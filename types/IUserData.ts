import { ITask } from "../index.js";

export interface IUserData {
  authorized: boolean;
  login: string;
  tasks: ITask[];
  authToken: string;
}
