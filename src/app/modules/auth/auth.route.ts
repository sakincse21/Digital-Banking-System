import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post('/login', AuthControllers.login)
router.post('/logout', AuthControllers.logout)


export const AuthRouter = router;