import { ITask, programm, taskPriorities } from "../../index.js";
import chalk from "chalk";
import { Helper } from "../HelpFunctions/Helper.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs/promises";
import { ISortedTask, sortTasks } from "./functions/sortTasks.js";
import { rl } from "../../readline.js";
import { saveTasks } from "./functions/saveTasks.js";
import { loadTasks } from "./functions/loadTasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class checkTaskController {
  private tasks: ITask[];
  private sortedTasks: ISortedTask[];

  #pathToUnauthorizedTasks = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "tasks",
    "tasks.json",
  );

  constructor(tasks: ITask[]) {
    this.tasks = tasks;
    this.sortedTasks = [];
  }

  private async handleSaveLoad(
    action: string,
    message?: string,
  ): Promise<boolean> {
    if (action === "S" || action === "s") {
      const { error, message: msg } = await saveTasks();
      this.showTasks(chalk.red.bold(error) || chalk.green(msg));
      return true;
    }
    if (action === "L" || action === "l") {
      const { error, message: msg } = await loadTasks();
      this.showTasks(chalk.red.bold(error) || chalk.green(msg));
      return true;
    }
    return false;
  }

  setPriorityColor(priority: taskPriorities): string {
    if (priority === "low") return chalk.green(priority);
    if (priority === "medium") return chalk.yellow(priority);
    return chalk.red(priority);
  }

  async loadTasks(
    helper: Helper,
  ): Promise<{ tasks: ITask[]; authorized: boolean; offlineMode: boolean }> {
    const { authorized, offlineMode } = await helper.checkAuthorized();

    if (!authorized || offlineMode) {
      const raw = await fs.readFile(this.#pathToUnauthorizedTasks, "utf-8");
      return { tasks: JSON.parse(raw), authorized, offlineMode };
    }

    const userData = await helper.getUserData();
    return { tasks: userData.tasks, authorized, offlineMode };
  }

  async persistTasks(tasks: ITask[], helper: Helper): Promise<void> {
    const { authorized, offlineMode } = await helper.checkAuthorized();

    if (!authorized || offlineMode) {
      await fs.writeFile(
        this.#pathToUnauthorizedTasks,
        JSON.stringify(tasks),
        "utf-8",
      );
    } else {
      const userData = await helper.getUserData();
      userData.tasks = tasks;
      await helper.setUserData(userData);
    }
  }

  printTasks(): void {
    if (!this.tasks.length) return;

    const sorted = sortTasks(this.tasks);
    this.sortedTasks = sorted;

    sorted.forEach(({ done, priority, title, visualIndex }) => {
      const label = done ? chalk.bgGreen.bold(title) : chalk.bold(title);
      console.log(
        `${chalk.yellow(visualIndex)}. ${label} [${this.setPriorityColor(priority)}]`,
      );
    });
  }

  async showTasks(message?: string) {
    console.clear();
    if (message) console.log(message);

    const helper = new Helper();
    const { tasks, authorized, offlineMode } = await this.loadTasks(helper);
    this.tasks = tasks;

    if (!this.tasks.length) {
      if (!authorized || offlineMode) {
        console.log(
          chalk.redBright("You don't have any tasks, please create them"),
        );
        await rl.question(chalk.gray("Press Enter for exit "));
        const start = new programm();
        process.argv = process.argv.slice(0, 2);
        start.onStart();
        return;
      }

      console.log(
        chalk.red("You don't have any tasks, please create them or:"),
      );
      const answer: string = await rl.question(
        `1) Save tasks (S)\n2) Load tasks (L)\n3) ${chalk.red("Exit (Enter)")}\n`,
      );
      if (answer === "") {
        new programm().onStart();
        return;
      }
      const response = await this.handleSaveLoad(answer);
      if (!response) this.showTasks();
      return;
    }

    this.printTasks();
    console.log(chalk.gray("\nPress Enter for exit"));

    if (!authorized || offlineMode) {
      const answer = await rl.question(
        `Pick the task index for read (1-${this.tasks.length}): `,
      );
      if (answer === "") {
        const start = new programm();
        process.argv = process.argv.slice(0, 2);
        start.onStart();
        return;
      }
      this.showTaskContent(+answer);
      return;
    }

    const answer = await rl.question(
      `Pick the task index for read (1-${this.tasks.length})\nSave tasks (S) / Load tasks (L)\n`,
    );
    if (answer === "") {
      new programm().onStart();
      return;
    }
    if (await this.handleSaveLoad(answer)) return;
    this.showTaskContent(+answer);
  }

  async showTaskContent(taskIndex: number) {
    console.clear();
    const task = this.sortedTasks.find(
      (item) => item.visualIndex === taskIndex,
    );
    if (!task) return this.showTasks();

    const terminalWidth = process.stdout.columns || 80;

    const titlePad = Math.max(
      0,
      Math.floor((terminalWidth - task.title.length - 2) / 2),
    );
    const contentPad = Math.max(
      0,
      Math.floor((terminalWidth - task.content.length - 2) / 2),
    );

    console.log(
      chalk.bgBlackBright(" ").repeat(titlePad) +
        chalk.yellow(` ${task.title} `) +
        chalk.bgBlackBright(" ").repeat(titlePad),
    );
    console.log(
      chalk.bgBlackBright(" ").repeat(contentPad) +
        ` ${task.content} ` +
        chalk.bgBlackBright(" ").repeat(contentPad),
    );

    const action = await rl.question(
      `Actions:\n${chalk.yellow.bold("1) Finish")}\n${chalk.red.bold("2) Delete")}\n3) Exit\n`,
    );

    const helper = new Helper();

    switch (action) {
      case "1": {
        this.tasks[task.index].done = !this.tasks[task.index].done;
        await this.persistTasks(this.tasks, helper);
        this.showTasks();
        break;
      }
      case "2": {
        const newTasks = this.tasks.filter((_, i) => i !== task.index);
        await this.persistTasks(newTasks, helper);
        this.showTasks();
        break;
      }
      case "3":
      default:
        this.showTasks();
        break;
    }
  }
}
