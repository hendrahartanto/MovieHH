import { Request, Response, NextFunction } from "express";

type AsyncFunction<TReq extends Request = Request> = (
  req: TReq,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const asyncHandler =
  <TReq extends Request = Request>(execution: AsyncFunction<TReq>) =>
  (req: Request, res: Response, next: NextFunction) => {
    execution(req as TReq, res, next).catch(next); // catch(next) shorthand for: .catch((error) => next(error)).
  };

export default asyncHandler;
