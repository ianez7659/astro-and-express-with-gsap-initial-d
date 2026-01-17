import { BASE_URL } from "../util/constants";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePic: string;
  };
}

export async function handleLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json(); // if success
}
