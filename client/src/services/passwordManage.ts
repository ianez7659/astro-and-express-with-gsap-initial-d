import { BASE_URL } from "../util/constants";

interface ResetInfo {
  userId: string;
  resetToken: string;
  newPassword: string;
}

type ForgotPasswordResult =
  | { type: "success"; resetToken: string; message: string }
  | { type: "failure"; errorMessage: string };

type ResetPasswordResult =
  | { type: "success"; message: string }
  | { type: "failure"; errorMessage: string };

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `${email}`,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Forgot password failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error JSON:", jsonError);
      }

      console.error("Forgot password Error:", errorMessage);
      return { type: "failure", errorMessage: errorMessage };
    }
    const data = await response.json();
    return {
      type: "success",
      resetToken: data.resetToken,
      message: data.message,
    };
  } catch (error) {
    console.error("Error Forgot password:", error);
    return { type: "failure", errorMessage: "Network error occurred" };
  }
}

export async function resetPassword({
  userId,
  resetToken,
  newPassword,
}: ResetInfo): Promise<ResetPasswordResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: `${userId}`,
        resetToken: `${resetToken}`,
        newPassword: `${newPassword}`,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Reset password failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error JSON:", jsonError);
      }

      console.error("Reset password Error:", errorMessage);
      return { type: "failure", errorMessage: errorMessage };
    }
    const data = await response.json();
    return { type: "success", message: data.message };
  } catch (error) {
    console.error("Error Reset password:", error);
    return { type: "failure", errorMessage: "Network error occurred" };
  }
}
