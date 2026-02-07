import { parseArgs } from "./parseArgs.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as readline from "readline/promises";
import { addTaskAction } from "./cases/onAddCase.js";
import { listCaseAction } from "./cases/onListCase.js";
import { onHelpAction } from "./cases/onHelp.js";
import { gotoTask } from "./cases/gotoTask.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pathToTasks = path.join(__dirname, "..", "..", "tasks", "tasks.json");

export const onCli = async () => {
  const { command, flags } = parseArgs(process.argv);

  if (command === "add") {
    await addTaskAction(flags);
  } else if (command === "list") {
    listCaseAction(pathToTasks, false);
  } else if (/^\d+$/.test(command!)) {
    gotoTask(command!);
  } else if (command === "tolist") {
    console.clear();
    listCaseAction(pathToTasks, true);
  } else if (command === "help") {
    onHelpAction();
  } else {
    return;
  }
};
