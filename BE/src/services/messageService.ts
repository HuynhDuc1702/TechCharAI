import { Message, MessageRole } from "../generated/prisma";
import { CreateMessageDTO } from "../Dtos/createMessageDTO";
import * as messageRepo from "../repositories/messageRepo";
import AppError from "../utils/appError";
import { EditMessageDTO } from "../Dtos/editMessageDTO";
import { DeleteMessagesDTO } from "../Dtos/deleteMessagesDTO";
import { getResponse } from "./llmService";
import { deleteVector, insertVector, searchVector, updateVector } from "./vectorService";

export const getMessagesForChat = async (
    chatId: string,
    page: number,
    limit: number
): Promise<Message[]> => {
    try {
        return await messageRepo.getMessagesForChat(chatId, page, limit);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to get messages", 500);
    }
};

export const sendMessage = async (data: CreateMessageDTO) => {
    try {

        console.log("Sent message data:", data);
        //Save the user message into database first
        const createdUserMessage = await messageRepo.sendMessage(data);

        //Search similar message to this message from vectorDB
        const ids = await searchVector(data.content, data.sessionId);
        const similarMessages = await messageRepo.getMessageByIds(ids);
        console.log("Similar messages:", similarMessages);

        //Get the last messages in the chat session
        const lastMessages = await messageRepo.getLastMessages(10, data.sessionId);

        const messageHistory = [...similarMessages, ...lastMessages].map((message) => ({
            role: message.role,
            content: message.content
        }));

        //get the response from LLM
        const responseContent = await getResponse(data.content, data.characterId, messageHistory);

        //Save the AI message into database
        const createdAIMessage = await messageRepo.sendMessage({
            content: responseContent,
            sessionId: data.sessionId,
            role: MessageRole.assistant,
            characterId: data.characterId
        });

        //Save both user message and AI message into vectorDB for furture context
        await Promise.all([
            insertVector(data.content, createdUserMessage.id, data.sessionId),
            insertVector(responseContent, createdAIMessage.id, data.sessionId)
        ]);


        return responseContent;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to send message", 500);
    }
};

export const deleteMessages = async (data: DeleteMessagesDTO) => {
    try {
        console.log("deleteMessages data:", data);
        await messageRepo.deleteMessages(data);
        const ids = data.ids;
        await Promise.all(ids.map((id) => deleteVector(id)));

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to delete message", 500);
    }
};
export const getMessageById = async (id: string) => {
    try {
        return await messageRepo.getMessageById(id);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to get message", 500);
    }
};

export const editMessage = async (data: EditMessageDTO, id: string) => {
    try {
        await messageRepo.editMessage(data, id);
        await updateVector(data.content, id, data.sessionId);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to delete session", 500);
    }
};
