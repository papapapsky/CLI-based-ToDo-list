// personalFetch/refreshToken.ts
import "dotenv/config";

interface IRefreshResponse {
  accessToken: string;
  error?: string;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const response = await fetch(process.env.POST_REFRESH!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data: IRefreshResponse = await response.json();

    if (data.error) {
      console.error("Failed to refresh token:", data.error);
      return null;
    }

    return data.accessToken;
  } catch (e) {
    console.error("Error refreshing token:", e);
    return null;
  }
}
