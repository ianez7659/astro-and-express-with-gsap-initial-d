import { getLatestToken } from "./sessionstorage";
import { validateToken } from "./validateToken";

export async function checkAuth(): Promise<boolean> {
    try {
        const tokenResult = await getLatestToken();
        if (!tokenResult.success || !tokenResult.data) {
            return false;
        }

        const validationResult = await validateToken();
        return validationResult.success;
    } catch (error) {
        console.error("Auth check failed:", error);
        return false;
    }
}