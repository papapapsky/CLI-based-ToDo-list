import chalk from "chalk";
import { emailValidation } from "./validation/emailValidation.js";
import { postReq } from "../../../personalFetch/postReq.js";
import { rl } from "../../../readline.js";
import "dotenv/config";
import { visualWaiting } from "./visuals/wait.js";
import { Helper } from "../../HelpFunctions/Helper.js";
import { programm } from "../../../index.js";

interface IRegisterResponse {
  error: string;
  accessToken: string;
  refreshToken: string;
}

const fields = ["login", "password", "email"] as const;
type Field = (typeof fields)[number];

type IRegData = Record<Field, string>;

export class Registration {
  async sendData(data: IRegData) {
    const timer = visualWaiting();
    try {
      const url: string | undefined = process.env.POST_REGISTRATION!;
      const response: IRegisterResponse = await postReq(data, false, url);
      console.clear();
      if (response.error) {
        return this.registrationMenu(response.error);
      }
      return this.codeConfirmation(data);
    } catch (e) {
      this.registrationMenu("Failed to send request. Please try again");
    } finally {
      visualWaiting(timer as NodeJS.Timeout);
    }
  }

  async registrationMenu(errorMessage?: string) {
    console.clear();
    console.log(chalk.yellow("Registration"));
    errorMessage ? console.log(chalk.red(errorMessage)) : null;
    const login = await rl.question("Your login: ");
    const password = await rl.question("Your password: ");
    const email = await rl.question("Your email: ");

    if (!login || !password || !emailValidation(email)) {
      const start = new programm();
      start.onStart(chalk.red("Your information is invalid. Please try again"));
      return;
    }

    await this.sendData({ login, password, email });
  }

  async codeConfirmation(data: IRegData) {
    const answer = await rl.question(
      "We send code on your email, please write it: ",
    );
    try {
      const url = process.env.POST_SEND_CODE!;
      const response: IRegisterResponse = await postReq(
        { ...data, code: answer },
        false,
        url,
      );
      if (response.error) {
        return this.registrationMenu(response.error);
      }
      const helper = new Helper();
      await helper.setUserData({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        login: data.login,
        tasks: (await helper.getTasks()) ?? [],
        authorized: true,
        offlineMode: false,
      });
      const startPage = new programm();
      startPage.onStart(chalk.green("Successfully registration!"));
    } catch (e) {
      console.log(e);
      this.registrationMenu("Failed to create account, please try again");
    }
  }
}
