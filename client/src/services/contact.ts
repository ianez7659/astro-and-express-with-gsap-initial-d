import { BASE_URL } from "../util/constants";

type SendContactResult =
  | { type: "success"; message: string; submittedAt: Date }
  | { type: "failure"; errorMessage: string };

interface ContactInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function submitContact(
  token: string,
  request: ContactInput
): Promise<SendContactResult> {
  try {
    const response = await fetch(`${BASE_URL}/api/submit/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${request.name}`,
        email: `${request.email}`,
        phone: `${request.phone}`,
        message: `${request.message}`,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Send contacts failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        console.error("Error parsing error JSON:", jsonError);
        return { type: "failure", errorMessage: "Error parsing response JSON" };
      }

      console.error("Send contacts Error:", errorMessage);
      return { type: "failure", errorMessage: errorMessage };
    }

    try {
      const data = await response.json();
      return {
        type: "success",
        message: data.message,
        submittedAt: data.submittedAt,
      };
    } catch (jsonError) {
      console.error("Error parsing error JSON:", jsonError);
      return { type: "failure", errorMessage: "Error parsing response JSON" };
    }
  } catch (error) {
    console.error("Error Send contacts:", error);
    return { type: "failure", errorMessage: "Network error occurred" };
  }
}
