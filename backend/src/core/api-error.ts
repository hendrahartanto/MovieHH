import { Response } from "express";
import {
  AuthFailureResponse,
  BadRequestResponse,
  ForbiddenResponse,
  InternalErrorResponse,
  NotFoundResponse,
} from "./api-response";

export enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  TOKEN_EXPIRED = "TokenExpiredError",
  UNAUTHORIZED = "AuthFailureError",
  ACCESS_TOKEN = "AccessTokenError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  NO_ENTRY = "NoEntryError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  FORBIDDEN = "ForbiddenError",
}

export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = "error") {
    super(type);
  }

  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res);
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message).send(res);
      case ErrorType.NO_DATA:
      case ErrorType.NOT_FOUND:
        return new NotFoundResponse(err.message).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res);
      default: {
        let message = err.message;
        // Do not send failure message in production as it may send sensitive data
        // if (environment === 'production') message = 'Something wrong happened.';
        return new InternalErrorResponse(message).send(res);
      }
    }
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = "Invalid credentials") {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = "Internal error") {
    super(ErrorType.INTERNAL, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(messgae = "Token is not valid") {
    super(ErrorType.BAD_TOKEN, messgae);
  }
}

export class TokenExpireError extends ApiError {
  constructor(messgae = "Token is expired") {
    super(ErrorType.TOKEN_EXPIRED, messgae);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = "Invalid access token") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

export class NoDataError extends ApiError {
  constructor(messgae = "Data not found") {
    super(ErrorType.NO_DATA, messgae);
  }
}
