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

  async printTasks() {
    const setPriorityColor = (priority: taskPriorities) => {
      if (priority === "low") return `${chalk.green(priority)}`;
      if (priority === "medium") return chalk.yellow(priority);
      if (priority === "high") return chalk.red(priority);
    };

    if (!this.tasks.length) {
      console.log(
        chalk.redBright("You don`t have any tasks, please create them"),
      );
      await rl.question(chalk.gray("Press Enter for exit "));
      const start = new programm();
      process.argv = process.argv.slice(0, 2);
      start.onStart();
      return;
    }
    const taskPresentational = sortTasks(this.tasks);
    taskPresentational.forEach(({ done, priority, title, visualIndex }) => {
      console.log(
        `${chalk.yellow(visualIndex)}. ${!done ? chalk.bold(title) : chalk.bgGreen.bold(title)} [${setPriorityColor(priority)}]`,
      );
    });
    this.sortedTasks = taskPresentational;
  }
  async showTasks(message?: string) {
    console.clear();
    message ? console.log(message) : null;
    const helper = new Helper();
    let tasks: ITask[] = [];

    let { authorized, offlineMode } = await helper.checkAuthorized();
    if (!authorized || offlineMode) {
      const toStringTasks = await fs.readFile(
        this.#pathToUnauthorizedTasks,
        "utf-8",
      );
      tasks = JSON.parse(toStringTasks);
    } else if (authorized && !offlineMode) {
      const authorizedUserData = await helper.getUserData();
      tasks = authorizedUserData.tasks;
    }

    this.tasks = tasks;
    this.printTasks();

    console.log(chalk.gray("\nPress Enter for exit"));

    let answer;
    if (!authorized || offlineMode) {
      answer = await rl.question(
        `Pick the task index for read (1-${this.tasks.length}): `,
      );
      if (answer === "") {
        const start = new programm();
        process.argv = process.argv.slice(0, 2);
        return start.onStart();
      }
      this.showTaskContent(+answer);
      return;
    } else {
      answer = await rl.question(
        `1) Pick the task index for read (1-${this.tasks.length})\n2) Save tasks (S)\n3) Load tasks (L)\n`,
      );
      if (answer === "") {
        const start = new programm();
        start.onStart();
        return;
      }
      if (answer === "S" || answer === "s") {
        const { error, message } = await saveTasks();
        if (error) {
          this.showTasks(chalk.red.bold(error));
          return;
        }
        this.showTasks(chalk.green(message));
        return;
      }
      if (answer === "L" || answer === "l") {
        const { error, message } = await loadTasks();
        if (error) {
          this.showTasks(chalk.red.bold(error));
          return;
        }
        this.showTasks(chalk.green(message));
        return;
      }
      this.showTaskContent(+answer);
      return;
    }
  }

  async showTaskContent(taskIndex: number) {
    console.clear();
    const task = this.sortedTasks.find(
      (item) => item.visualIndex === taskIndex,
    );
    if (!task) return this.showTasks();

    const terminalWidth = process.stdout.columns || 80;
    const titlePadding = Math.floor((terminalWidth - task.title.length) / 2);
    const contentPadding = Math.floor(
      (terminalWidth - task.content.length) / 2,
    );

    console.log(
      chalk.bgBlackBright(" ").repeat(titlePadding - 2) +
        chalk.yellow(` ${task.title} `) +
        chalk.bgBlackBright(" ").repeat(titlePadding - 2),
    );
    console.log(
      chalk.bgBlackBright(" ").repeat(contentPadding - 2) +
        ` ${task.content} ` +
        chalk.bgBlackBright(" ").repeat(contentPadding - 2),
    );

    const action = await rl.question(
      `Actions:\n${chalk.yellow.bold("1) Finish")}\n${chalk.red.bold("2) Delete")}\n3) Exit\n`,
    );

    switch (action) {
      case "1": {
        this.tasks[task.index].done = !this.tasks[task.index].done;
        const helper = new Helper();
        const { authorized, offlineMode } = await helper.checkAuthorized();
        if (!authorized || offlineMode) {
          await fs.writeFile(
            this.#pathToUnauthorizedTasks,
            JSON.stringify(this.tasks),
            "utf-8",
          );
        } else if (!offlineMode && authorized) {
          const userData = await helper.getUserData();
          userData.tasks = this.tasks;
          await helper.setUserData(userData);
        }
        this.showTasks();
        break;
      }
      case "2": {
        const newTasks = this.tasks.filter(
          (item) => item !== this.tasks[task.index],
        );
        const helper = new Helper();
        const { authorized, offlineMode } = await helper.checkAuthorized();
        if (!authorized || offlineMode) {
          await fs.writeFile(
            this.#pathToUnauthorizedTasks,
            JSON.stringify(newTasks),
            "utf-8",
          );
        } else if (authorized && !offlineMode) {
          const userData = await helper.getUserData();
          userData.tasks = newTasks;
          await helper.setUserData(userData);
        }
        this.showTasks();
        break;
      }
      case "3":
        this.showTasks();
        break;
      default:
        this.showTasks();
        break;
    }
  }
}
