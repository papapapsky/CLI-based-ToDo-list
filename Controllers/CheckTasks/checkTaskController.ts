import { ITask, programm, taskPriorities } from "../../index.js";
import * as readline from "readline/promises";
import chalk from "chalk";
import { Helper } from "../HelpFunctions/Helper.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs/promises";
import { addTaskController } from "../AddTask/addTaskController.js";
import { ISortedTask, sortTasks } from "./functions/sortTasks.js";
import { Registration } from "../Registration/Registration.js";
import { rl } from "../../readline.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class checkTaskController {
  private tasks: ITask[];
  private sortedTasks: ISortedTask[];

  #pathToTasks = path.join(__dirname, "..", "..", "..", "tasks", "tasks.json");

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
  async showTasks() {
    console.clear();
    const toStringTasks = await fs.readFile(this.#pathToTasks, "utf-8");
    const parsedTasks: ITask[] = JSON.parse(toStringTasks);
    this.tasks = parsedTasks;

    this.printTasks();

    console.log(chalk.gray("\nPress Enter for exit"));
    const answer = await rl.question(
      `Pick the task index for read (1-${this.tasks.length}): `,
    );
    if (answer === "") {
      const start = new programm();
      process.argv = process.argv.slice(0, 2);
      return start.onStart();
    }
    this.showTaskContent(+answer);
    return;
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

    const helper = new Helper();
    const tasks: ITask[] = await helper.getTasks(this.#pathToTasks);

    switch (action) {
      case "1": {
        tasks[task.index].done = !tasks[task.index].done;
        await fs.writeFile(this.#pathToTasks, JSON.stringify(tasks), "utf-8");
        this.showTasks();
        break;
      }
      case "2": {
        const newTasks = tasks.filter((item) => item !== tasks[task.index]);
        await fs.writeFile(
          this.#pathToTasks,
          JSON.stringify(newTasks),
          "utf-8",
        );
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
