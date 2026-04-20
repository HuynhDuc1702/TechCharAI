import { CreateMessageDTO } from "../Dtos/createMessageDTO";
import { DeleteMessagesDTO } from "../Dtos/deleteMessagesDTO";
import { EditMessageDTO } from "../Dtos/editMessageDTO";
import { Message } from "../generated/prisma";
import { prisma } from "../lib/prisma";

export const getMessagesForChat = async (
    chatId: string,
    page: number,
    limit: number,
): Promise<Message[]> => {
    return prisma.message.findMany({
        where: { sessionId: chatId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit
    }).then(messages => messages.reverse());
};

export const sendMessage = async (data: CreateMessageDTO) => {
    const { characterId, ...messageData } = data;
    return prisma.message.create({
        data: messageData
    });
};

export const editMessage = async (data: EditMessageDTO, id: string) => {
    return prisma.message.update({
        where: { id },
        data,
    });
};

export const deleteMessages = async (data: DeleteMessagesDTO) => {
    return prisma.message.deleteMany({
        where: { id: { in: data.ids }, sessionId: data.sessionId },
    });
};
export const getMessageById = async (id: string) => {
    return prisma.message.findUnique({
        where: { id },
    });
};
export const getMessageByIds = async (
    ids: string[]
): Promise<Message[]> => {
    return prisma.message.findMany({
        where: { id: { in: ids } },
        orderBy: { createdAt: "asc" },
    });
};
export const getLastMessages = async (quantity: number, sessionId: string) => {
    return prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: "desc" },
        take: quantity
    }).then(messages => messages.reverse());
};
