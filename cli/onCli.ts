import { addTaskController } from "../Controllers/AddTask/addTaskController.js";
import { parseArgs } from "./parseArgs.js";
import { taskPriorities } from "../index.js";
import { checkTaskController } from "../Controllers/CheckTasks/checkTaskController.js";
import fs from "fs/promises";
import { ITask } from "../index.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as readline from "readline/promises";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const onCli = async (rl: readline.Interface) => {
  const { command, flags } = parseArgs(process.argv);

  switch (command) {
    case "add": {
      const addTask = new addTaskController(rl);
      await addTask.constructTask(
        flags.title as string,
        (flags.content as string) ?? "",
        (flags.priority as taskPriorities) ?? "low",
      );
      process.exit(0);
      break;
    }
    case "list": {
      console.clear();
      const pathToTasks = path.join(
        __dirname,
        "..",
        "..",
        "tasks",
        "tasks.json",
      );
      const tasks = await fs.readFile(pathToTasks, "utf-8");
      const parsedTasks: ITask[] = JSON.parse(tasks);

      const showTasks = new checkTaskController(parsedTasks, rl);
      showTasks.showTasks();
      break;
    }
    default:
      return;
  }
};
