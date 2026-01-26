import fs from "fs/promises";
import { ITask } from "../../index.js";

export class Helper {
  async getTasks(path: string) {
    const tasks = await fs.readFile(path, "utf-8");
    return JSON.parse(tasks) satisfies ITask[];
  }
}
