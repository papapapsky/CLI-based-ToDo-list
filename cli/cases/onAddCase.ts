import { addTaskController } from "../../Controllers/AddTask/addTaskController.js";
import { taskPriorities } from "../../index.js";

export const addTaskAction = async (
  flags: Record<string, string | boolean>,
) => {
  const addTask = new addTaskController();
  await addTask.constructTask(
    flags.title as string,
    (flags.content as string) ?? "",
    (flags.priority as taskPriorities) ?? "low",
  );
  process.exit(0);
};
