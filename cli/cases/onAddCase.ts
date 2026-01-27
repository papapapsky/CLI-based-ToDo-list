import { addTaskController } from "../../Controllers/AddTask/addTaskController.js";
import * as readline from "readline/promises";
import { taskPriorities } from "../../index.js";

export const addTaskAction = async (
  rl: readline.Interface,
  flags: Record<string, string | boolean>,
) => {
  const addTask = new addTaskController(rl);
  await addTask.constructTask(
    flags.title as string,
    (flags.content as string) ?? "",
    (flags.priority as taskPriorities) ?? "low",
  );
  process.exit(0);
};
