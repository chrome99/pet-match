import { createContext } from "react";

export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  bio: string;
  token: string;
  admin: boolean;
};

export type UserContextType = {
  user: IUser | null;
  changeUser: Function;
};

type opString = string | undefined;
type eraseable = null;
export interface IUpdateUser {
  firstName: opString;
  lastName: opString;
  phone: opString;
  email: opString;
  password: opString;
  bio: opString | eraseable;
}

export const UserContext = createContext<UserContextType | null>(null);
