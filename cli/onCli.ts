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
import { addTaskAction } from "./cases/onAddCase.js";
import { listCaseAction } from "./cases/onListCase.js";
import { onHelpAction } from "./cases/onHelp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathToTasks = path.join(__dirname, "..", "..", "tasks", "tasks.json");

export const onCli = async (rl: readline.Interface) => {
  const { command, flags } = parseArgs(process.argv);

  switch (command) {
    case "add": {
      await addTaskAction(rl, flags);
      break;
    }
    case "list": {
      listCaseAction(pathToTasks, rl, false);
      break;
    }
    case "tolist": {
      console.clear();
      listCaseAction(pathToTasks, rl, true);
      break;
    }
    case "help": {
      onHelpAction();
      break;
    }
    default:
      return;
  }
};
