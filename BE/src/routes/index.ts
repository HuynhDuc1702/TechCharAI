import { Router } from "express";
import characterRoutes from "./characterRoutes";
import userRoutes from "./userRoutes";
import chatRoutes from "./chatRoutes";
import messageRoutes from "./messageRoutes";
import uploadRoutes from "./uploadRoutes";


const router = Router();


router.use("/character" ,characterRoutes);
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/message", messageRoutes);
router.use("/upload", uploadRoutes);

export default router;
