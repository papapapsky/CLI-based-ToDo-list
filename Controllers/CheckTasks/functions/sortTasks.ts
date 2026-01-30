import { ITask } from "../../../index.js";

export interface ISortedTask extends ITask {
  index: number;
  visualIndex: number;
}

export const sortTasks = (tasks: ITask[]): ISortedTask[] => {
  const lowTasks: ISortedTask[] = [];
  const mediumTasks: ISortedTask[] = [];
  const highTasks: ISortedTask[] = [];

  tasks.forEach((item, i) => {
    switch (item.priority) {
      case "low":
        lowTasks.push({ ...item, index: i, visualIndex: 0 });
        break;
      case "medium":
        mediumTasks.push({ ...item, index: i, visualIndex: 0 });
        break;
      case "high":
        highTasks.push({ ...item, index: i, visualIndex: 0 });
    }
  });
  const sortedTasks: ISortedTask[] = [
    ...highTasks,
    ...mediumTasks,
    ...lowTasks,
  ];
  const finishedTasks = sortedTasks.filter((item) => item.done);
  const unfinishedTasks = sortedTasks.filter((item) => !item.done);
  const allTasks: ISortedTask[] = unfinishedTasks.concat(finishedTasks);
  allTasks.forEach((item, i) => (item.visualIndex = i + 1));
  return allTasks;
};
