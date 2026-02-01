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
    try {
      const url: string | undefined = process.env.POST_REGISTRATION!;
      const inteval = visualWaiting();
      const response: IRegisterResponse = await postReq(data, false, url);
      visualWaiting(inteval as NodeJS.Timeout);
      console.clear();
      if (response.error) {
        return this.registrationMenu(response.error);
      }
      return this.codeConfirmation(data);
    } catch (e) {
      this.registrationMenu("Failed to send request. Please try again");
    }
  }

  async registrationMenu(errorMessage?: string) {
    while (true) {
      console.clear();
      console.log(chalk.yellow("Registration"));
      errorMessage ? console.log(chalk.red(errorMessage)) : null;
      const login = await rl.question("Your login: ");
      const password = await rl.question("Your password: ");
      const email = await rl.question("Your email: ");

      if (!login || !password || !emailValidation(email)) {
        console.log(chalk.red("Invalid input, try again."));
        continue;
      }

      await this.sendData({ login, password, email });
      break;
    }
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
        tasks: [],
        authorized: true,
      });
      console.clear();
      await rl.question(
        chalk.green.bold("Successfully registration! Press any key for leave."),
      );
      const startPage = new programm();
      startPage.onStart();
    } catch (e) {
      console.log(e);
      this.registrationMenu("Failed to create account, please try again");
    }
  }
}
