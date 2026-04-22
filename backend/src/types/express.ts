import { loginType } from "../interface/logIn/logInType";

declare module "express-serve-static-core" {
  interface Request {
    validatedBody?: loginType;
  }
}

declare module "express-session" {
  interface SessionData {
    user?: {
      username: string;
    };
  }
}