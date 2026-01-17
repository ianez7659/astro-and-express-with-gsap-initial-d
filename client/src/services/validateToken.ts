import { getLatestToken, setLatestToken } from "../services/sessionstorage";
import { BASE_URL } from "../util/constants";

export async function validateToken() {
  try {
    const token = await getLatestToken();
    
    // Check if token exists
    if (!token.success || !token.data) {
      return { success: false, error: "No token found" };
    }
    
    const response = await fetch(`${BASE_URL}/api/auth/validate-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.data}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = `validateToken failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error JSON:", jsonError);
      }

      console.error("validateToken Error:", errorMessage);
      return { success: false, error: errorMessage };
    }
    const data = await response.json();
    setLatestToken(data.token);

    return { success: true };
  } catch (error) {
    console.error("Error validateToken:", error);
    return { success: false, error: "Network error occurred" };
  }
}
