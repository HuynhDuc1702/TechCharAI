import { Request, Response } from "express";
import { uploadImageBuffer } from "../services/cloudinaryService";

export const uploadImageController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No image file provided" });
      return;
    }

    const url = await uploadImageBuffer(req.file.buffer, req.file.mimetype);
    res.status(200).json({ url });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message ?? "Upload failed" });
  }
};
