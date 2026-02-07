import chalk from "chalk";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { addTaskController } from "./Controllers/AddTask/addTaskController.js";
import path, { dirname } from "path";
import { checkTaskController } from "./Controllers/CheckTasks/checkTaskController.js";
import { onCli } from "./cli/onCli.js";
import { Registration } from "./Controllers/Auth/Registration/Registration.js";
import { rl } from "./readline.js";
import { Helper } from "./Controllers/HelpFunctions/Helper.js";
import { Login } from "./Controllers/Auth/Login/Login.js";

export type taskPriorities = "low" | "medium" | "high";

export const taskPriority = {
  low: "low",
  medium: "medium",
  high: "high",
} as const;

export interface ITask {
  folder: string;
  title: string;
  content: string;
  done: boolean;
  priority: taskPriorities;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class programm {
  #tasksPath = path.join(__dirname, "..", "tasks", "tasks.json");

  private async showTasks() {
    const tasks = await fs.readFile(this.#tasksPath, "utf-8");
    const parsedTasks: ITask[] = JSON.parse(tasks);

    const checkTask = new checkTaskController(parsedTasks);
    await checkTask.showTasks();
  }

  async constructTask() {
    const taskController = new addTaskController();

    const title: string = (await taskController.setTitle()) ?? "";
    if (!title) return this.onStart();

    const content: string = (await taskController.setContent()) ?? "";
    if (!content) return this.onStart();

    const priority: taskPriorities =
      (await taskController.setPriority()) ?? "low";
    if (!priority) return this.onStart();

    await taskController.constructTask(title, content, priority);
  }

  async onStart(message?: string) {
    const args = process.argv.slice(2);
    if (args.length !== 0) {
      await onCli();
      return;
    }
    console.clear();
    message ? console.log(message) : null;
    const helper = new Helper();
    const userData = await helper.getUserData();
    if (!userData.authorized) {
      const answer = await rl.question(
        `${chalk.green("What do you want to do")} \n1) Check tasks\n2) Add task\n3) ${chalk.yellow.bold("Registration")}\n4) ${chalk.blue.bold("Login")}\n5) ${chalk.red.bold("Exit")}\n`,
      );

      switch (answer) {
        case "1":
          this.showTasks();
          break;
        case "2":
          this.constructTask();
          break;
        case "3":
          const toRegistration = new Registration();
          toRegistration.registrationMenu();
          break;
        case "4":
          const loginPage = new Login();
          loginPage.loginMenu();
          break;
        case "5":
          process.exit(0);
        default:
          this.showTasks();
      }
    } else {
      const offlineMode = userData.offlineMode;
      const answer = await rl.question(
        `${chalk.green("What do you want to do")} \n1) Check tasks\n2) Add task\n3) ${chalk.yellow.bold("Logout")}\n4) ${offlineMode ? chalk.blueBright("Online mode") : chalk.gray("Offline mode")}\n5) ${chalk.red.bold("Exit")}\n`,
      );

      switch (answer) {
        case "1":
          this.showTasks();
          break;
        case "2":
          this.constructTask();
          break;
        case "3":
          console.clear();
          const confirmation = await rl.question(
            "Do you really want to logout? (y/n) ",
          );
          switch (confirmation) {
            case "y":
              await helper.setUserData({
                authorized: false,
                accessToken: "",
                refreshToken: "",
                login: "",
                tasks: [],
                offlineMode: false,
              });
              this.onStart();
              break;
            default:
              this.onStart();
          }
          break;
        case "4":
          await helper.setUserData({
            ...userData,
            offlineMode: !userData.offlineMode,
          });
          this.onStart();
          break;
        case "5":
          process.exit(0);
        default:
          this.showTasks();
      }
    }
  }
}

const startProgramm = new programm();
startProgramm.onStart();
