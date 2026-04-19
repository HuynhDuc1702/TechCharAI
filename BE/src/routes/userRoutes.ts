import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();


router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/refresh", userController.verifyRefreshToken);
router.get("/logout", userController.logout);



export default router;
