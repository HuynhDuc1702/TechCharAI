import { Router } from "express";
import { authToken } from "../middleware/authToken";
import { imageUpload } from "../middleware/imageUpload";
import { uploadImageController } from "../controllers/uploadController";

const router = Router();

router.post("/", authToken, imageUpload.single("image"), uploadImageController);

export default router;
