import { createContext } from "react";

export type IUser = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  admin: boolean;
};

export type UserContextType = {
  user: IUser | null;
  changeUser: Function;
};

export const UserContext = createContext<UserContextType | null>(null);
