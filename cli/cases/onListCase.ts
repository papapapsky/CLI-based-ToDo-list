import fs from "fs/promises";
import { ITask } from "../../index.js";
import { checkTaskController } from "../../Controllers/CheckTasks/checkTaskController.js";
import readline from "readline/promises";

export const listCaseAction = async (
  pathToTasks: string,
  rl: readline.Interface,
  goto: boolean,
) => {
  const tasks = await fs.readFile(pathToTasks, "utf-8");
  const parsedTasks: ITask[] = JSON.parse(tasks);

  const showTasks = new checkTaskController(parsedTasks, rl);
  if (goto) {
    showTasks.showTasks();
    return;
  }
  showTasks.printTasks();
  process.exit(0);
};
