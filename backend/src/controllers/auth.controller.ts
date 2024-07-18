import { NextFunction, Request, Response } from "express";
import { getGoogleOAuthTokens, getGoogleUser } from "../services/auth.services";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma-client";
import { HttpError } from "../helpers/HttpError";
import { createApiResponse } from "../helpers/createApiResponse";

const COOKIE_MAX_AGE_MILISECONDS = 60 * 60 * 1000;
const oneHourInMs = 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
const expiresIn = `${COOKIE_MAX_AGE_MILISECONDS / oneHourInMs}h`;

const googleOAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;

    const { id_token, access_token } = await getGoogleOAuthTokens(code);

    const googleUser = await getGoogleUser({ id_token, access_token });

    const user = await prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          password: "",
        },
      });

      const payload = {
        id: newUser.id,
      };
      const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn });

      return res
        .cookie("token", token, {
          maxAge: COOKIE_MAX_AGE_MILISECONDS,
          httpOnly: true,
        })
        .status(200)
        .send(
          createApiResponse({
            user: { username: newUser.name, id: newUser.id },
            message: "Logged in succesfully",
          })
        );
    }

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn });

    return res
      .cookie("token", token, {
        maxAge: COOKIE_MAX_AGE_MILISECONDS,
        httpOnly: true,
      })
      .status(200)
      .send(
        createApiResponse({
          user: { username: user.name, id: user.id },
          message: "Logged in succesfully",
        })
      );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw HttpError(409, { message: "User with that email already exist" });
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        password: hashPassword,
        name: username,
        email,
      },
    });

    const payload = {
      id: newUser.id,
    };
    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn });

    return res.json(
      createApiResponse({
        user: { username: newUser.name, id: newUser.id },
        token,
      })
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw HttpError(400, { message: "Email or password is incorerct" });
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (user.password !== hashPassword) {
      throw HttpError(400, { message: "Email or password is incorerct" });
    }

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn });

    return res.json(
      createApiResponse({
        user: { username: user.name, id: user.id },
        token,
      })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  googleOAuth,
  register,
};
