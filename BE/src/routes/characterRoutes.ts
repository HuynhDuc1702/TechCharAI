import { Router } from "express";
import * as characterController from "../controllers/characterController";
import { authToken } from "../middleware/authToken";

const router = Router();

router.get("/", characterController.getAllCharacters);
router.get("/my", authToken, characterController.getMyCharacters);
router.get("/:id", characterController.getCharacter);
router.post("/", authToken, characterController.addCharacter);
router.put("/:id", authToken, characterController.updateCharacter);
router.delete("/:id", authToken, characterController.deleteCharacter);

export default router;
