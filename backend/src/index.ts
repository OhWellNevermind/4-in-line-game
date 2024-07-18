import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routers/auth";
import { getGoogleOAuthURL } from "./utils";
import { createApiResponse } from "./helpers/createApiResponse";
import { handleError } from "./middlewars/handleError";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

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
