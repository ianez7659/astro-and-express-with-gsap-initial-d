const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
// JWT_SECRET: Use environment variable, fallback to default for local development only
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";
const TOKEN_EXPIRY = "1h";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

let users = [];
let resetTokens = {};

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

const findUserById = (userId) => users.find((user) => user.id === userId);

// ------------------- Auth Routes -------------------

app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const existingUser = users.find((user) => user.email === email);
  if (existingUser)
    return res.status(409).json({ error: "Email already in use" });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    profilePic: null,
    firstName: null,
    lastName: null,
    phone: null,
    address: null,
    createdAt: new Date(),
  };

  users.push(newUser);
  const token = generateToken(newUser.id);
  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser.id,
      name,
      email,
      firstName: null,
      lastName: null,
      phone: null,
      address: null,
      profilePic: null,
      createdAt: newUser.createdAt,
    },
    token,
  });
});

app.post("/api/auth/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const user = users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({
    message: "Sign in successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
      address: user.address || null,
      profilePic: user.profilePic,
    },
    token,
  });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = users.find((u) => u.email === email);
  if (!user)
    return res.json({
      message:
        "If your email is registered, you will receive a password reset link",
    });

  const resetToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  resetTokens[user.id] = { token: resetToken, expires: Date.now() + 600000 };

  res.json({ message: "Password reset instructions sent", resetToken });
});

app.post("/api/auth/reset-password", (req, res) => {
  const { userId, resetToken, newPassword } = req.body;
  if (!userId || !resetToken || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const resetData = resetTokens[userId];
  if (
    !resetData ||
    resetData.token !== resetToken ||
    resetData.expires < Date.now()
  ) {
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  users[userIndex].password = bcrypt.hashSync(newPassword, 10);
  delete resetTokens[userId];

  res.json({ message: "Password has been reset successfully" });
});

app.post("/api/auth/validate-token", verifyToken, (req, res) => {
  const user = findUserById(req.userId);
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
      profilePic: user.profilePic,
    },
    token,
  });
});

// ------------------- Profile Routes -------------------

app.get("/api/user/profile", verifyToken, (req, res) => {
  const user = findUserById(req.userId);
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
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    },
  });
});

// ✅ CORRIGIDO: Rota protegida com verifyToken
app.put("/api/user/profile", verifyToken, (req, res) => {
  const { name, email, firstName, lastName, phone, address } = req.body;
  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  if (name) users[userIndex].name = name;
  if (email) {
    const exists = users.some((u) => u.email === email && u.id !== req.userId);
    if (exists) return res.status(409).json({ error: "Email already in use" });
    users[userIndex].email = email;
  }
  if (firstName !== undefined) users[userIndex].firstName = firstName;
  if (lastName !== undefined) users[userIndex].lastName = lastName;
  if (phone !== undefined) users[userIndex].phone = phone;
  if (address !== undefined) users[userIndex].address = address;

  res.json({
    message: "Profile updated successfully",
    user: {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      firstName: users[userIndex].firstName,
      lastName: users[userIndex].lastName,
      phone: users[userIndex].phone,
      address: users[userIndex].address,
      profilePic: users[userIndex].profilePic,
    },
  });
});

app.post("/api/user/profile-picture", verifyToken, (req, res) => {
  const { profilePic } = req.body; // base64 string
  if (!profilePic) return res.status(400).json({ error: "No image provided" });

  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  // Store base64 image directly
  users[userIndex].profilePic = profilePic;
  res.json({
    message: "Profile picture uploaded successfully",
    profilePic: users[userIndex].profilePic,
  });
});

app.delete("/api/user/profile-picture", verifyToken, (req, res) => {
  const userIndex = users.findIndex((u) => u.id === req.userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  users[userIndex].profilePic = null;
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
  res.json({ status: "ok", timestamp: new Date() });
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
