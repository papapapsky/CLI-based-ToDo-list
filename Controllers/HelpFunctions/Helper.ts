import fs from "fs/promises";
import { ITask } from "../../index.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { IUserData } from "../../types/IUserData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Helper {
  async getTasks() {
    const pathToData = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "tasks",
      "tasks.json",
    );
    const tasks = await fs.readFile(pathToData, "utf-8");
    return JSON.parse(tasks) satisfies ITask[];
  }

  async getUserData() {
    const pathToData = path.join(__dirname, "..", "..", "..", "userData.json");
    const userData = await fs.readFile(pathToData, "utf-8");
    return JSON.parse(userData) as IUserData;
  }

  async setUserData({
    accessToken,
    login,
    tasks,
    authorized,
    refreshToken,
  }: IUserData) {
    const userData = await this.getUserData();
    userData.accessToken = accessToken;
    userData.refreshToken = refreshToken;
    userData.login = login;
    userData.tasks = tasks;
    userData.authorized = authorized;

    await fs.writeFile(
      path.join(__dirname, "..", "..", "..", "userData.json"),
      JSON.stringify(userData),
      "utf-8",
    );
    return userData;
  }

  async checkAuthorized() {
    const userData = await this.getUserData();
    if (userData.authorized) return true;
    return false;
  }
}
