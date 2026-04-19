import { Session } from "../generated/prisma";
import { prisma } from "../lib/prisma";
import { CreateSessionDTO } from "../Dtos/createSessionDTO";

export const findSessionsByCharAndUser = async (
  userId: string,
  characterId: string
): Promise<Session[]> => {
  return prisma.session.findMany({
    where: { userId, characterId },
    orderBy: { updatedAt: "desc" },
  });
};

export const findSessionById = async (id: string) => {
  return prisma.session.findUnique({
    where: { id },
    include: { messages: true },
  });
};

export const createSession = async (data: CreateSessionDTO): Promise<Session> => {
  return prisma.session.create({
    data,
  });
};

export const deleteSession = async (id: string): Promise<Session | null> => {
  return prisma.session.delete({
    where: { id },
  });
};
