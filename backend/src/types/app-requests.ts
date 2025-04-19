import { Role, User } from "@prisma/client";
import { Request } from "express";

export interface ProtectedRequest extends Request {
  user: User;
}
