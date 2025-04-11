import { Request } from "express";
import { JwtPayload } from "./jwt-payload";

export interface ProtectedRequest extends Request {
  user: JwtPayload;
}
