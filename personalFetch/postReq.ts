import { Helper } from "../Controllers/HelpFunctions/Helper.js";
import { refreshAccessToken } from "./refreshToken.js";

export async function postReq(
  data: any,
  useAuth: boolean,
  url: string,
): Promise<any> {
  const helper = new Helper();
  const userData = await helper.getUserData();

  let accessToken = userData?.accessToken;

  const makeRequest = async (token?: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (useAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return response;
  };

  let response = await makeRequest(accessToken);

  if (response.status === 401 && useAuth && userData?.refreshToken) {
    const newAccessToken = await refreshAccessToken(userData.refreshToken);

    if (newAccessToken) {
      await helper.setUserData({
        ...userData,
        accessToken: newAccessToken,
      });

      response = await makeRequest(newAccessToken);
    } else {
      throw new Error("Session expired. Please login again.");
    }
  }

  return response.json();
}
