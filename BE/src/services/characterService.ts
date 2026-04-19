import { Character } from "../generated/prisma";
import { CreateCharacterDTO } from "../Dtos/createCharacterDTO";
import { UpdateCharacterDTO } from "../Dtos/updateCharacterDTO";
import * as charRepo from "../repositories/charRepo";
import AppError from "../utils/appError";

export const getAllCharacters = async (): Promise<Character[]> => {
  try {
    return await charRepo.findAllCharacters();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to get characters", 500);
  }
};

export const getCharactersByUser = async (creatorId: string): Promise<Character[]> => {
  try {
    return await charRepo.findCharactersByCreatorId(creatorId);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to get user characters", 500);
  }
};

export const getCharacter = async (id: string): Promise<Character | null> => {
  try {
    return await charRepo.findCharacterById(id);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to get character", 500);
  }
};

export const createCharacter = async (data: CreateCharacterDTO): Promise<Character> => {
  try {
    return await charRepo.createCharacter(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to create character", 500);
  }
};

export const updateCharacter = async (
  id: string,
  data: UpdateCharacterDTO
): Promise<Character | null> => {
  try {
    return await charRepo.updateCharacter(id, data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to update character", 500);
  }
};

export const deleteCharacter = async (id: string): Promise<Character | null> => {
  try {
    return await charRepo.deleteCharacter(id);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to delete character", 500);
  }
};