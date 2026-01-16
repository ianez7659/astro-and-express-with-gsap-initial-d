import { BASE_URL } from "../util/constants";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    profilePic: string | null;
    createdAt: string;
}

export const updateProfilePicture = async (file: File, token: string) => {
    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const response = await fetch(`${BASE_URL}/api/user/profile-picture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePic: base64 }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
    }

    const data = await response.json();
    return data;
};

export const updateProfile = async (profileData: {
    firstName: string;
    lastName: string;
    name: string;
    phone: string;
    email: string;
    address: string;
}, token: string) => {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
    }

    return await response.json();
};

export const getUser = async (token: string): Promise<{ user: UserProfile }> => {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user profile");
    }

    return await response.json();
};

