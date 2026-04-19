import { Router } from "express";
import * as chatController from "../controllers/chatController";
import { authToken } from "../middleware/authToken";

const router = Router();

router.get("/character/:characterId", authToken, chatController.getSessionsByCharacterAndUser);
router.get("/:id", authToken, chatController.getSession);
router.post("/", authToken, chatController.createSession);
router.delete("/:id", authToken, chatController.deleteSession);

export default router;
