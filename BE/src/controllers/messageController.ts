import { Request, response, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import * as messageService from "../services/messageService";
import { MessageRole } from "../generated/prisma";
import { CreateMessageDTO } from "../Dtos/createMessageDTO";
export const getMessagesForChat = async (req: Request, res: Response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const chatId = req.params.chatId as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    try {
        const messages = await messageService.getMessagesForChat(chatId, page, limit);
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error when get messages", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const sendMessage = async (req: Request, res = response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { sessionId, content } = req.body;
    if (!sessionId || !content) {
        return res.status(400).json({ message: "sessionId and content are required" });
    }
    try {
        const role = MessageRole.user;

        const createMessageDTO: CreateMessageDTO = {
            content,
            sessionId,
            role,
            characterId: req.params.characterId as string
        }

        const responseContent = await messageService.sendMessage(createMessageDTO);
        return res.status(200).json(responseContent);
    } catch (error) {
        console.error("Error when send message", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const editMessage = async (req: Request, res = response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }


    const id = req.params.id as string;

    const message = await messageService.getMessageById(id);
    if (!message) {
        return res.status(404).json({ message: "Message not found" });
    }


    try {
        const messages = await messageService.editMessage({ content, sessionId: message.sessionId }, id);
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error when edit message", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const deleteMessages = async (req: Request, res = response) => {
    const payload = req.user as JwtPayload;
    const userId = payload?.id as string;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { ids } = req.body;
    const sessionId = req.params.chatId as string;


    try {

        for (let i = 0; i < ids.length; i++) {
            const existingMessage = await messageService.getMessageById(ids[i])
            if (!existingMessage) {
                return res.status(404).json({ message: "Message not found" });
            }
        }


        await messageService.deleteMessages({ ids, sessionId });
        return res.status(200).json("Messages deleted successfully");
    } catch (error) {
        console.error("Error when delete messages", error);
        return res.status(500).json({ message: "System Error" });
    }
};
