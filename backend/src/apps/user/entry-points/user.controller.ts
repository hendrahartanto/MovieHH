import { SuccessResponse } from "../../../lib/http/api-response";
import asyncHandler from "../../../lib/utils/async.util";
import { ProtectedRequest } from "../../../types/app-requests";
import userRepository from "../data-access/user.repository";
import { z } from "zod";
import { BadRequestError } from "../../../lib/exceptions/api-error";

const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

const toggleUserSuspensionSchema = z.object({
  isSuspended: z.boolean(),
});

const getUsersAdmin = asyncHandler<ProtectedRequest>(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const { users, total } = await userRepository.getUsersPaginatedAdmin(
    page,
    limit,
    search
  );

  new SuccessResponse("Get admin users successful", {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }).send(res);
});

const updateUserRoleAdmin = asyncHandler<ProtectedRequest>(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user.id;

  if (targetUserId === currentUserId) {
    throw new BadRequestError("You cannot modify your own administrator role status.");
  }

  const validatedData = updateUserRoleSchema.parse(req.body);

  const updatedUser = await userRepository.updateUserRole(
    targetUserId,
    validatedData.role
  );

  new SuccessResponse("Update user role successful", {
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    },
  }).send(res);
});

const toggleUserSuspensionAdmin = asyncHandler<ProtectedRequest>(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user.id;

  if (targetUserId === currentUserId) {
    throw new BadRequestError("You cannot suspend your own administrator account.");
  }

  const validatedData = toggleUserSuspensionSchema.parse(req.body);

  const updatedUser = await userRepository.toggleUserSuspension(
    targetUserId,
    validatedData.isSuspended
  );

  new SuccessResponse("Toggle user suspension successful", {
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isSuspended: updatedUser.isSuspended,
    },
  }).send(res);
});

export default {
  getUsersAdmin,
  updateUserRoleAdmin,
  toggleUserSuspensionAdmin,
};
