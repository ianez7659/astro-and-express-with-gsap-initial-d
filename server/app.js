const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const supabase = require("./supabase");

const app = express();
// JWT_SECRET: Use environment variable, fallback to default for local development only
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";
const TOKEN_EXPIRY = "1h";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Supabase를 사용하여 사용자 찾기
const findUserById = async (userId) => {
  if (!supabase) {
    console.error("Supabase client not initialized");
    return null;
  }
  
  const { data, error } = await supabase
    .from("initiald_users")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  // Supabase 컬럼명을 JavaScript 객체 속성명으로 변환
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password,
    profilePic: data.profile_pic,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    address: data.address,
    createdAt: data.created_at,
  };
};

// ------------------- Auth Routes -------------------

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  // 이메일 중복 확인
  const { data: existingUser } = await supabase
    .from("initiald_users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = Date.now().toString();
  
  const { data: newUser, error } = await supabase
    .from("initiald_users")
    .insert({
      id: userId,
      name,
      email,
      password: hashedPassword,
      profile_pic: null,
      first_name: null,
      last_name: null,
      phone: null,
      address: null,
    })
    .select()
    .single();

  if (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }

  const token = generateToken(newUser.id);
  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      firstName: newUser.first_name || null,
      lastName: newUser.last_name || null,
      phone: newUser.phone || null,
      address: newUser.address || null,
      profilePic: newUser.profile_pic || null,
      createdAt: newUser.created_at,
    },
    token,
  });
});

app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  const { data: user, error } = await supabase
    .from("initiald_users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({
    message: "Sign in successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      firstName: user.first_name || null,
      lastName: user.last_name || null,
      phone: user.phone || null,
      address: user.address || null,
      profilePic: user.profile_pic || null,
    },
    token,
  });
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  const { data: user } = await supabase
    .from("initiald_users")
    .select("id")
    .eq("email", email)
    .single();

  if (!user) {
    return res.json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  }

  const resetToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  
  const expiresAt = new Date(Date.now() + 600000); // 10 minutes

  // 기존 토큰 삭제 후 새 토큰 삽입
  await supabase
    .from("initiald_reset_tokens")
    .delete()
    .eq("user_id", user.id);

  const { error } = await supabase
    .from("initiald_reset_tokens")
    .insert({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    console.error("Reset token error:", error);
    return res.status(500).json({ error: "Failed to create reset token" });
  }

  res.json({ message: "Password reset instructions sent", resetToken });
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { userId, resetToken, newPassword } = req.body;
  if (!userId || !resetToken || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  // 토큰 확인
  const { data: resetData, error: tokenError } = await supabase
    .from("initiald_reset_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("token", resetToken)
    .single();

  if (tokenError || !resetData) {
    return res.status(400).json({ error: "Invalid reset token" });
  }

  // 만료 확인
  if (new Date(resetData.expires_at) < new Date()) {
    await supabase
      .from("initiald_reset_tokens")
      .delete()
      .eq("user_id", userId);
    return res.status(400).json({ error: "Reset token has expired" });
  }

  // 비밀번호 업데이트
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  const { error: updateError } = await supabase
    .from("initiald_users")
    .update({ password: hashedPassword })
    .eq("id", userId);

  if (updateError) {
    return res.status(500).json({ error: "Failed to update password" });
  }

  // 토큰 삭제
  await supabase
    .from("initiald_reset_tokens")
    .delete()
    .eq("user_id", userId);

  res.json({ message: "Password has been reset successfully" });
});

app.post("/api/auth/validate-token", verifyToken, async (req, res) => {
  const user = await findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = generateToken(user.id);
  res.json({
    message: "Token is valid",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
      address: user.address || null,
      profilePic: user.profilePic || null,
    },
    token,
  });
});

// ------------------- Profile Routes -------------------

app.get("/api/user/profile", verifyToken, async (req, res) => {
  const user = await findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
      address: user.address || null,
      profilePic: user.profilePic || null,
      createdAt: user.createdAt,
    },
  });
});

app.put("/api/user/profile", verifyToken, async (req, res) => {
  const { name, email, firstName, lastName, phone, address } = req.body;

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  // 이메일 중복 확인 (다른 사용자가 사용 중인지)
  if (email) {
    const { data: existingUser } = await supabase
      .from("initiald_users")
      .select("id")
      .eq("email", email)
      .neq("id", req.userId)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }
  }

  // 업데이트할 데이터 준비
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (firstName !== undefined) updateData.first_name = firstName;
  if (lastName !== undefined) updateData.last_name = lastName;
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;

  const { data: updatedUser, error } = await supabase
    .from("initiald_users")
    .update(updateData)
    .eq("id", req.userId)
    .select()
    .single();

  if (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }

  res.json({
    message: "Profile updated successfully",
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      firstName: updatedUser.first_name || null,
      lastName: updatedUser.last_name || null,
      phone: updatedUser.phone || null,
      address: updatedUser.address || null,
      profilePic: updatedUser.profile_pic || null,
    },
  });
});

app.post("/api/user/profile-picture", verifyToken, async (req, res) => {
  const { profilePic } = req.body; // base64 string
  if (!profilePic) return res.status(400).json({ error: "No image provided" });

  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  const { data: updatedUser, error } = await supabase
    .from("initiald_users")
    .update({ profile_pic: profilePic })
    .eq("id", req.userId)
    .select()
    .single();

  if (error) {
    console.error("Profile picture update error:", error);
    return res.status(500).json({ error: "Failed to update profile picture" });
  }

  res.json({
    message: "Profile picture uploaded successfully",
    profilePic: updatedUser.profile_pic,
  });
});

app.delete("/api/user/profile-picture", verifyToken, async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  const { error } = await supabase
    .from("initiald_users")
    .update({ profile_pic: null })
    .eq("id", req.userId);

  if (error) {
    console.error("Profile picture delete error:", error);
    return res.status(500).json({ error: "Failed to remove profile picture" });
  }

  res.json({ message: "Profile picture removed successfully" });
});

// ------------------- Forms -------------------

app.post("/api/submit/contact", verifyToken, (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  res
    .status(201)
    .json({ message: "Form submitted successfully", submittedAt: new Date() });
});

app.post("/api/submit/feedback", verifyToken, (req, res) => {
  const { rating, feedback } = req.body;
  if (!rating || !feedback) {
    return res.status(400).json({ error: "Rating and feedback are required" });
  }

  res.status(201).json({
    message: "Feedback submitted successfully",
    submittedAt: new Date(),
  });
});

// ------------------- Utilities -------------------

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date(),
    database: supabase ? "connected" : "not configured"
  });
});

// Export for Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
