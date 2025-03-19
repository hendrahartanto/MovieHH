import express from "express";
import asyncHandler from "../../../middlewares/async-handler";
import { createUserSchema } from "../domain/dto/create-user.dto";
import authService from "../domain/auth.service";
import { SuccessResponse } from "../../../core/api-response";

const register = asyncHandler(async (req, res) => {
  const validatedData = createUserSchema.parse(req.body);
  const user = await authService.registerUser(validatedData);

  new SuccessResponse("Register Successful", { user }).send(res);
});

export default {
  register,
};
