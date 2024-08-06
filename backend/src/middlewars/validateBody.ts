import { ZodSchema } from "zod";

import { Request, Response, NextFunction } from "express";
import { HttpError } from "../helpers/HttpError";

export const validateBody = (zodSchema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { success, error } = zodSchema.safeParse(body);
    if (!success) {
      const { issues } = error;
      return next(HttpError(400, { message: issues[0].message }));
    }
    next();
  };
};
