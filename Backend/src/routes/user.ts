import { Router, Request, Response } from "express";
import { login, register } from "../controllers/user";

const router = Router();

router.post("/api/user/register", (req: Request, res: Response) => {
  register(req, res);
});

router.post("/api/user/login", (req: Request, res: Response) => {
  login(req, res);
});

export default router;
