import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { IUserData } from "../types/IUserData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const postReq = async (withToken: boolean, url: string) => {
  try {
    let token = "";
    if (withToken) {
      const pathToData = path.join(__dirname, "..", "userData.json");
      const userData = await fs.readFile(pathToData, "utf-8");
      const parsedData: IUserData = JSON.parse(userData);
      const authToken = parsedData.accessToken;
      if (!authToken) return;
      token = authToken;
    }

    const request = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await request.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};
