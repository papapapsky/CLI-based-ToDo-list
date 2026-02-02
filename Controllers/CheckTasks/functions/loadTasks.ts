import "dotenv/config";
import { getReq } from "../../../personalFetch/getReq.js";
import { Helper } from "../../HelpFunctions/Helper.js";
import { ITask } from "../../../index.js";
import { visualWaiting } from "../../Auth/Registration/visuals/wait.js";

interface IResponse {
  tasks: ITask[];
  error: string;
}

export const loadTasks = async () => {
  let timer;
  try {
    timer = visualWaiting();
    const url = process.env.POST_LOAD_TASKS!;
    const response: IResponse = await getReq(url, true);
    console.clear();

    if (response.error) {
      return { error: response.error };
    }

    const helper = new Helper();
    const userData = await helper.getUserData();
    userData.tasks = response.tasks;
    await helper.setUserData(userData);

    return { error: "", message: "You have successfully loaded your tasks!" };
  } catch (e) {
    return { error: "Failed to send request. Please try again later." };
  } finally {
    visualWaiting(timer as NodeJS.Timeout);
  }
};
