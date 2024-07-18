import { NextFunction, Request, Response } from "express";
import { createApiResponse } from "../helpers/createApiResponse";

export function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { status = 500, message = "Server error", details = {} } = err;
  console.log(message);
  res.status(status).json(createApiResponse({ message, details }, err));
}
