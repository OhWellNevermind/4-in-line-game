import express from "express";
import cors from "cors";
import "dotenv/config";
import { createApiResponse } from "./helpers/createApiResponse";
import { handleError } from "./middlewars/handleError";
import { isAuthenticated } from "./middlewars/isAuthentificated";
import { getGoogleOAuthURL } from "./utils/getGoogleOAuthUrl";
import authRouter from "./routers/auth.router";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

console.log(getGoogleOAuthURL());

app.get("/", isAuthenticated, (req, res) => {});

app.use((req, res) => {
  res.status(404).json(
    createApiResponse(
      {
        message: "Not Found",
      },
      true
    )
  );
});

app.use(handleError);

app.listen(process.env.PORT, () => {
  console.log(`Your server started on http://localhost:${process.env.PORT}`);
});
