import express from "express";
import cors from "cors";
import { ApiResponse } from "./types/common.type.js";
import { API_PREFIX } from "./config/constants.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "2mb" }));

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/", (_request, response) => {
  const body: ApiResponse<never> = {
    success: true,
    message: "Service API is running",
  };

  response.status(200).json(body);
});

app.use(API_PREFIX, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
