import { getLatestToken } from "../../src/services/sessionstorage";

export async function updateUserProfile(
  token: string,
  updatedData: any
): Promise<boolean> {
  try {
    // Commented out until token validation is ready
    /*
    const response = await fetch("http://localhost:3000/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Response:", errorResponse);
      throw new Error("Failed to update profile");
    }

    return true;
    */
    console.log("Mock update:", updatedData);
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById(
    "profile-form"
  ) as HTMLFormElement | null;

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      firstName: (document.getElementById("firstName") as HTMLInputElement)
        .value,
      lastName: (document.getElementById("lastName") as HTMLInputElement).value,
      userName: (document.getElementById("userName") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      address: (document.getElementById("address") as HTMLTextAreaElement)
        .value,
    };

    const tokenResponse = await getLatestToken();
    if (tokenResponse.success && tokenResponse.data) {
      const result = await updateUserProfile(tokenResponse.data, updatedData);
      if (result) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } else {
      alert("Token missing.");
    }
  });
});
