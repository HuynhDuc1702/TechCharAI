import { MessageRole } from "../generated/prisma";

export type CreateMessageDTO = {
    content: string;
    sessionId: string;
    role: MessageRole;

    characterId: string;
};
