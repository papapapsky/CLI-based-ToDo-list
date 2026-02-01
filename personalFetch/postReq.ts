import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { IUserData } from "../types/IUserData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const headers: Record<string, string> = {
  "Content-Type": "application/json",
};

export const postReq = async (body: any, withToken: boolean, url: string) => {
  try {
    let token = "";
    if (withToken) {
      const pathToData = path.join(__dirname, "..", "userData.json");
      const userData = await fs.readFile(pathToData, "utf-8");
      const parsedData: IUserData = JSON.parse(userData);
      const authToken = parsedData.authToken;
      if (!authToken) return;
      token = authToken;
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;
    const request = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const response = await request.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};
