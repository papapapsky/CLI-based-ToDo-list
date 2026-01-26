import chalk from "chalk";
import { stdin, stdout } from "process";
import * as readline from "readline/promises";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { addTaskController } from "./Controllers/AddTask/addTaskController.js";
import path, { dirname } from "path";
import { checkTaskController } from "./Controllers/CheckTasks/checkTaskController.js";
import { onCli } from "./cli/onCli.js";

export type taskPriorities = "low" | "medium" | "high";

export const taskPriority = {
  low: "low",
  medium: "medium",
  high: "high",
} as const;

export interface ITask {
  title: string;
  content: string;
  done: boolean;
  priority: taskPriorities;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class programm {
  #tasksPath = path.join(__dirname, "..", "tasks", "tasks.json");
  #rl = readline.createInterface({ input: stdin, output: stdout });

  private async showTasks() {
    const tasks = await fs.readFile(this.#tasksPath, "utf-8");
    const parsedTasks: ITask[] = JSON.parse(tasks);

    const checkTask = new checkTaskController(parsedTasks, this.#rl);
    await checkTask.showTasks();
  }

  async constructTask() {
    const taskController = new addTaskController(this.#rl);

    const title: string = (await taskController.setTitle()) ?? "";
    if (!title) return this.onStart();

    const content: string = (await taskController.setContent()) ?? "";
    if (!content) return this.onStart();

    const priority: taskPriorities =
      (await taskController.setPriority()) ?? "low";
    if (!priority) return this.onStart();

    await taskController.constructTask(title, content, priority);
  }

  async onStart() {
    const args = process.argv.slice(2);
    if (args.length !== 0) {
      await onCli(this.#rl);
      return;
    }
    console.clear();

    const answer = await this.#rl.question(
      `${chalk.green("What do you want to do")} \n1) Check tasks\n2) Add task\n3) ${chalk.red.bold("Exit")}\n`,
    );

    switch (answer) {
      case "1":
        await this.showTasks();
        break;
      case "2":
        await this.constructTask();
        break;
      case "3":
        process.exit(0);
      default:
        await this.showTasks();
    }
  }
}

const startProgramm = new programm();
startProgramm.onStart();
