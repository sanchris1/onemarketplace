import { Router } from "express";
import { ApiResponse } from "../types/common.type.js";
import { SERVICE_NAME } from "../config/constants.js";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  const body: ApiResponse<{
    service: string;
    status: "healthy";
    timestamp: string;
  }> = {
    success: true,
    message: "Server is healthy",
    data: {
      service: SERVICE_NAME,
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
  };

  response.status(200).json(body);
});
