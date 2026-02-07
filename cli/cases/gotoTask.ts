import { checkTaskController } from "../../Controllers/CheckTasks/checkTaskController.js";
import { sortTasks } from "../../Controllers/CheckTasks/functions/sortTasks.js";
import { Helper } from "../../Controllers/HelpFunctions/Helper.js";
import type { ITask } from "../../index.js";

export const gotoTask = async (id: string) => {
  let tasks: ITask[] = [];
  const currentFolder = process.cwd();
  const helper = new Helper();
  const userData = await helper.getUserData();
  if (userData.authorized && !userData.offlineMode) {
    tasks = userData.tasks.filter((t) => t.folder === currentFolder);
  } else {
    tasks = await new Helper().getTasks();
    tasks = tasks.filter((t) => t.folder === currentFolder);
  }
  const sortedTasks = sortTasks(tasks);
  return await new checkTaskController(tasks).showTaskContent(+id, sortedTasks);
};
