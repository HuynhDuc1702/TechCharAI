import { Request, response, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import * as sessionService from "../services/sessionService";

export const getSessionsByCharacterAndUser = async (req: Request, res: Response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const characterId = req.params.characterId as string;
    try {
        const sessions = await sessionService.getSessionsByCharAndUser(userId, characterId);
        return res.status(200).json(sessions);
    } catch (error) {
        console.error("Error when get sessions", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const getSession = async (req: Request, res = response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const id = req.params.id as string;
    try {
        const session = await sessionService.getSessionById(id);
        if (!session) {
            return res.status(404).json({ message: `Cannot find session with id=${id}` });
        }
        if (session.userId !== userId) {
            return res.status(403).json({ message: "Forbidden. You can't access this session" });
        }
        return res.status(200).json(session);
    } catch (error) {
        console.error("Error when get session", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const createSession = async (req: Request, res = response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { characterId } = req.body;
    if (!characterId) {
        return res.status(400).json({ message: "characterId is required" });
    }
    try {
        const session = await sessionService.createSession({ userId, characterId });
        return res.status(201).json(session);
    } catch (error) {
        console.error("Error when create session", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const deleteSession = async (req: Request, res = response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const id = req.params.id as string;
    try {
        const session = await sessionService.getSessionById(id);
        if (!session) {
            return res.status(404).json({ message: `Cannot find session with id=${id}` });
        }
        if (session.userId !== userId) {
            return res.status(403).json({ message: "Forbidden. You can't delete this session" });
        }
        await sessionService.deleteSession(id);
        return res.status(200).json("Session deleted successfully");
    } catch (error) {
        console.error("Error when delete session", error);
        return res.status(500).json({ message: "System Error" });
    }
};
