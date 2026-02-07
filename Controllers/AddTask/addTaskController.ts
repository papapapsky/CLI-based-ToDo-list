import type { taskPriorities } from "../../index.js";
import * as readline from "readline/promises";
import chalk from "chalk";
import { ITask, programm } from "../../index.js";
import { taskPriority } from "../../index.js";
import path, { dirname } from "path";
import fs from "fs/promises";
import { fileURLToPath } from "node:url";
import { rl } from "../../readline.js";
import { Helper } from "../HelpFunctions/Helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class addTaskController {
  #tasksPath = path.join(__dirname, "..", "..", "..", "tasks", "tasks.json");

  async setTitle() {
    console.clear();
    console.log(chalk.gray("Press Enter for exit\n"));
    const title = await rl.question(chalk.green("Please enter task name: "));
    if (title === "") return;
    return title;
  }

  async setContent() {
    console.clear();
    console.log(chalk.gray("Press Enter for exit\n"));
    const content = await rl.question(
      chalk.green("Now, please enter task content: "),
    );
    if (content === "") return;
    return content;
  }

  async setPriority() {
    console.clear();
    console.log(chalk.gray("Press Enter for exit\n"));
    const priority = await rl.question(
      chalk.green(
        "Now, please choose task priority: \n1) Low\n2) Medium\n3) High\n",
      ),
    );

    switch (priority) {
      case "1":
        return taskPriority.low;
      case "2":
        return taskPriority.medium;
      case "3":
        return taskPriority.high;
      default:
        return undefined;
    }
  }

  async constructTask(
    title: string,
    content: string,
    priority: taskPriorities,
  ) {
    const helper = new Helper();
    const currentFolder = process.cwd();
    const newTask: ITask = {
      title,
      content,
      priority,
      done: false,
      folder: currentFolder,
    };

    const currentTasks = await fs.readFile(this.#tasksPath, "utf-8");
    const parsed: ITask[] = JSON.parse(currentTasks);
    parsed.push(newTask);

    await fs.writeFile(
      this.#tasksPath,
      JSON.stringify(parsed, null, 2),
      "utf-8",
    );
    const { authorized, offlineMode } = await helper.checkAuthorized();
    if (authorized && !offlineMode) {
      const userData = await helper.getUserData();
      userData.tasks.push(newTask);
      await helper.setUserData(userData);
    }
    const start = new programm();
    start.onStart();
  }
}
