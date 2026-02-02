import { postReq } from "../../../personalFetch/postReq.js";
import "dotenv/config.js";
import { Helper } from "../../HelpFunctions/Helper.js";
import { visualWaiting } from "../../Auth/Registration/visuals/wait.js";

interface IResponse {
  error: string;
}

export const saveTasks = async () => {
  let timer;
  try {
    timer = visualWaiting();
    const userData = await new Helper().getUserData();
    const tasks = userData.tasks;
    const url = process.env.POST_SAVE_TASKS!;
    const response: IResponse = await postReq({ tasks }, true, url);
    console.clear();
    return { ...response, message: "Tasks saved." };
  } catch (e) {
    return {
      error: "Failed to send request. Please try again later.",
      message: "",
    };
  } finally {
    visualWaiting(timer as NodeJS.Timeout);
  }
};
