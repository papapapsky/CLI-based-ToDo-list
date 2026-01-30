import { ITask, taskPriorities } from "../../index.js";
import * as readline from "readline/promises";
import chalk from "chalk";
import { Helper } from "../HelpFunctions/Helper.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs/promises";
import { addTaskController } from "../AddTask/addTaskController.js";
import { ISortedTask, sortTasks } from "./functions/sortTasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class checkTaskController {
  private tasks: ITask[];
  private rl: readline.Interface;
  private sortedTasks: ISortedTask[];

  #pathToTasks = path.join(__dirname, "..", "..", "..", "tasks", "tasks.json");

  constructor(tasks: ITask[], rl: readline.Interface) {
    this.tasks = tasks;
    this.rl = rl;
    this.sortedTasks = [];
  }

  async #constructTask() {
    const taskController = new addTaskController(this.rl);
    const title: string | undefined = await taskController.setTitle();
    if (!title) return this.#toStart();

    const content: string | undefined = await taskController.setContent();
    if (!content) return this.#toStart();

    const priority: taskPriorities | undefined =
      await taskController.setPriority();
    if (!priority) return this.#toStart();
    await taskController.constructTask(title, content, priority);
    this.#toStart();
  }

  async #toStart() {
    console.clear();
    const toStringTasks = await fs.readFile(this.#pathToTasks, "utf-8");
    const parsedTasks: ITask[] = JSON.parse(toStringTasks);
    this.tasks = parsedTasks;

    const answer = await this.rl.question(
      `${chalk.green("What do you want to do")} \n1) Check tasks\n2) Add task\n3) ${chalk.red.bold("Exit")}\n`,
    );

    switch (answer) {
      case "1":
        this.showTasks();
        break;
      case "2":
        this.#constructTask();
        break;
      case "3":
        process.exit(0);
      default:
        this.showTasks();
    }
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
      await this.rl.question(chalk.gray("Press Enter for exit "));
      this.#toStart();
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
    const answer = await this.rl.question(
      `Pick the task index for read (1-${this.tasks.length}): `,
    );
    if (answer === "") return this.#toStart();
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

    const action = await this.rl.question(
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
