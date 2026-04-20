import { Router } from "express";
import * as messageController from "../controllers/messageController";
import { authToken } from "../middleware/authToken";

const router = Router();


router.get("/:chatId", authToken, messageController.getMessagesForChat);
router.post("/:characterId", authToken, messageController.sendMessage);
router.put("/:id", authToken, messageController.editMessage);
router.delete("/:chatId", authToken, messageController.deleteMessages);

export default router;
