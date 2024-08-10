import { NextFunction, Request, Response } from "express";

export const asyncErrorHandler = (func: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err: any) => next(err));
  };
};
