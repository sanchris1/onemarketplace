import { Router } from "express";
import { requireAuthentication } from "../../middleware/auth.middleware.js";
import { getAuthStatus, signup } from "./auth.controllers.js";

export const authRouter = Router();

authRouter.post("/sign-up", requireAuthentication, signup);
authRouter.get("/status", requireAuthentication, getAuthStatus);
