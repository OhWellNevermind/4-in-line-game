import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../helpers/HttpError";
import { User } from "@prisma/client";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

const { JWT_SECRET } = process.env;

export const isAuthenticated = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("authorization")?.split("Bearer ")[1];
    if (!token) {
      return next(HttpError(401));
    }

    const { id } = jwt.verify(token, JWT_SECRET as string) as User;

    if (!id) {
      return next(HttpError(401));
    }

    req.user = { id };
    next();
  }
);
