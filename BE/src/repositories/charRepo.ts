import { Character } from "../generated/prisma";
import { prisma } from "../lib/prisma";
import { CreateCharacterDTO } from "../Dtos/createCharacterDTO";
import { UpdateCharacterDTO } from "../Dtos/updateCharacterDTO";

export const findAllCharacters = async (): Promise<Character[]> => {
  return prisma.character.findMany();
};

export const findCharactersByCreatorId = async (creatorId: string): Promise<Character[]> => {
  return prisma.character.findMany({
    where: { creatorId },
    orderBy: { createdAt: "desc" },
  });
};

export const findCharacterById = async (id: string): Promise<Character | null> => {
  return prisma.character.findUnique({
    where: { id },
  });
};

export const createCharacter = async (data: CreateCharacterDTO): Promise<Character> => {
  return prisma.character.create({
    data,
  });
};

export const updateCharacter = async (
  id: string,
  data: UpdateCharacterDTO
): Promise<Character | null> => {
  return prisma.character.update({
    where: { id },
    data,
  });
};

export const deleteCharacter = async (id: string): Promise<Character | null> => {
  return prisma.character.delete({
    where: { id },
  });
};
