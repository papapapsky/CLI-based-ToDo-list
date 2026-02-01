import chalk from "chalk";
import { rl } from "../../../readline.js";
import { postReq } from "../../../personalFetch/postReq.js";
import "dotenv/config";
import { visualWaiting } from "../Registration/visuals/wait.js";
import { Helper } from "../../HelpFunctions/Helper.js";
import { programm } from "../../../index.js";

interface IUserData {
  password: string;
  email: string;
}

interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  error?: string;
  login: string;
  tasks: any[];
}

export class Login {
  async sendData(userData: IUserData) {
    const timer = visualWaiting();
    try {
      const url = process.env.POST_LOGIN!;
      const response: ILoginResponse = await postReq(userData, false, url);
      console.clear();

      if (response.error) {
        this.loginMenu(response.error);
        return;
      }

      const helper = new Helper();
      await helper.setUserData({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        login: response.login,
        tasks: response.tasks,
        authorized: true,
      });

      await rl.question("Successfully login! Press any key to leave.");
      const start = new programm();
      start.onStart();
    } catch (e) {
      this.loginMenu("Failed to login. Please try again");
    } finally {
      visualWaiting(timer as NodeJS.Timeout);
    }
  }

  async loginMenu(errorMessage?: string) {
    while (true) {
      console.clear();
      console.log(chalk.blue("Login"));
      errorMessage ? console.log(chalk.red(errorMessage)) : null;

      const email = await rl.question("Your email: ");
      const password = await rl.question("Your password: ");

      if (!password || !email) {
        continue;
      }

      const userData = { password, email };
      return this.sendData(userData);
    }
  }
}
