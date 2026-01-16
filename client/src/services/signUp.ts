import { BASE_URL } from "../util/constants";

export async function signUp({
  name,
  email,
  password,
}: {
  name: string | null;
  email: string | null;
  password: string | null;
}) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${name}`,
        email: `${email}`,
        password: `${password}`,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Signup failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error JSON:", jsonError);
      }

      console.error("Signup Error:", errorMessage);
      return { success: false, error: errorMessage };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error signUp:", error);
    return { success: false, error: "Network error occurred" };
  }
}
