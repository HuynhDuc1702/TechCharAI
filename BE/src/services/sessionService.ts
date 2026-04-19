import { Session } from "../generated/prisma";
import { CreateSessionDTO } from "../Dtos/createSessionDTO";
import * as sessionRepo from "../repositories/sessionRepo";
import AppError from "../utils/appError";

export const getSessionsByCharAndUser = async (
  userId: string,
  characterId: string
): Promise<Session[]> => {
  try {
    return await sessionRepo.findSessionsByCharAndUser(userId, characterId);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to get sessions", 500);
  }
};

export const getSessionById = async (id: string) => {
  try {
    return await sessionRepo.findSessionById(id);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to get session", 500);
  }
};

export const createSession = async (data: CreateSessionDTO): Promise<Session> => {
  try {
    return await sessionRepo.createSession(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to create session", 500);
  }
};

export const deleteSession = async (id: string): Promise<Session | null> => {
  try {
    return await sessionRepo.deleteSession(id);
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
