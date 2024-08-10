import { StatusCodes } from "../@types/helpersType";

export function HttpError(statusCode: StatusCodes, details = {}) {
  const errorMessages = {
    400: "Bad Request",
    401: "Not authorized",
    403: "Not verified",
    404: "Not Found",
    409: "Conflict",
  };

  if (!errorMessages[statusCode]) {
    throw Error("Unknown status code");
  }
  const error = new Error(errorMessages[statusCode]);

  return { ...error, status: statusCode, details };
}
