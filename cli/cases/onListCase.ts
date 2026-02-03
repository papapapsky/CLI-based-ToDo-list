import fs from "fs/promises";
import { ITask } from "../../index.js";
import { checkTaskController } from "../../Controllers/CheckTasks/checkTaskController.js";
import { Helper } from "../../Controllers/HelpFunctions/Helper.js";

export const listCaseAction = async (pathToTasks: string, goto: boolean) => {
  let tasks: ITask[] = [];
  const helper = new Helper();
  const userData = await helper.getUserData();
  if (userData.authorized && !userData.offlineMode) {
    tasks = userData.tasks;
  } else {
    const toStringedTasks = await fs.readFile(pathToTasks, "utf-8");
    tasks = JSON.parse(toStringedTasks);
  }

  const showTasks = new checkTaskController(tasks);
  if (goto) {
    showTasks.showTasks();
    return;
  }
  showTasks.printTasks();
  process.exit(0);
};
