enum SessionStorageKeys {
  user = "loginUser",
  token = "userToken",
  resetToken = "resetToken",
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  createdAt: string;
}

interface UpdateResponse {
  success: boolean;
  error?: string;
}

interface GetTokenResponse {
  success: boolean;
  data?: string | null;
  error?: string;
}

type GetTokenUserIdResponse =
  | { type: "success"; data: { token: string; userId: string } }
  | { type: "failure"; errorMessage: string };

export async function addLoginInfo(
  token: string,
  user: User
): Promise<UpdateResponse> {
  const oldToken = window.sessionStorage.getItem(SessionStorageKeys.token);
  const oldUser = window.sessionStorage.getItem(SessionStorageKeys.user);

  if (oldToken) {
    window.sessionStorage.removeItem(SessionStorageKeys.token);
  }
  if (oldUser) {
    window.sessionStorage.removeItem(SessionStorageKeys.user);
  }

  if (token && user) {
    try {
      window.sessionStorage.setItem(SessionStorageKeys.token, token);
      window.sessionStorage.setItem(
        SessionStorageKeys.user,
        JSON.stringify(user)
      );
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Error at addLoginInfo!",
      };
    }
  } else {
    window.sessionStorage.removeItem(SessionStorageKeys.token);
    window.sessionStorage.removeItem(SessionStorageKeys.user);
    return { success: false, error: "Error at addLoginInfo!" };
  }
}

export async function getLatestToken(): Promise<GetTokenResponse> {
  try {
    const token = window.sessionStorage.getItem(SessionStorageKeys.token);
    return { success: true, data: token };
  } catch {
    return { success: false, error: "Error at getLatestToken!" };
  }
}

export async function setLatestToken(token: string): Promise<UpdateResponse> {
  try {
    window.sessionStorage.setItem(SessionStorageKeys.token, token);
    return { success: true };
  } catch {
    return { success: false, error: "Error at setLatestToken!" };
  }
}

export async function removeLoginInfo(): Promise<UpdateResponse> {
  try {
    window.sessionStorage.removeItem(SessionStorageKeys.token);
    window.sessionStorage.removeItem(SessionStorageKeys.user);
    return { success: true };
  } catch {
    return { success: false, error: "Error at removeLoginInfo!" };
  }
}

export function getResetToken(): GetTokenUserIdResponse {
  try {
    const tokenString = window.sessionStorage.getItem(
      SessionStorageKeys.resetToken
    );
    const userString = window.sessionStorage.getItem(SessionStorageKeys.user);
    if (!tokenString) {
      throw new Error("Current token is missing in session storage.");
    }
    if (!userString) {
      throw new Error("User data is missing in session storage.");
    }
    const token: string = tokenString;
    const user: string = userString;
    const userObj = JSON.parse(user);
    return { type: "success", data: { token, userId: userObj.id } };
  } catch {
    return { type: "failure", errorMessage: "Error at getResetToken!" };
  }
}

export function setResetToken(token: string): UpdateResponse {
  try {
    window.sessionStorage.removeItem(SessionStorageKeys.resetToken);
    window.sessionStorage.setItem(SessionStorageKeys.resetToken, token);
    return { success: true };
  } catch {
    return { success: false, error: "Error at setResetToken!" };
  }
}
