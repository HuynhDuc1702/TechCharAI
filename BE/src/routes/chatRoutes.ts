import { Router } from "express";
import * as sessionController from "../controllers/sessionController";
import { authToken } from "../middleware/authToken";

const router = Router();

router.get("/character/:characterId", authToken, sessionController.getSessionsByCharacterAndUser);
router.get("/:id", authToken, sessionController.getSession);
router.post("/", authToken, sessionController.createSession);
router.delete("/:id", authToken, sessionController.deleteSession);

export default router;
