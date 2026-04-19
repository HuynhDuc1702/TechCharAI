import axiosClient from "./axiosClient";

export type Character = {
  id: string;
  name: string;
  description: string;
  personality: string;
  systemPrompt: string;
  avatarUrl?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCharacterPayload = {
  name: string;
  description: string;
  personality: string;
  systemPrompt: string;
  avatarUrl?: string;
};

export type UpdateCharacterPayload = {
  name?: string;
  description?: string;
  personality?: string;
  systemPrompt?: string;
  avatarUrl?: string;
};

export const getAllCharacters = async (): Promise<Character[]> => {
  const res = await axiosClient.get<Character[]>("/character");
  return res.data;
};

export const getMyCharacters = async (): Promise<Character[]> => {
  const res = await axiosClient.get<Character[]>("/character/my");
  return res.data;
};

export const getCharacterById = async (id: string): Promise<Character> => {
  const res = await axiosClient.get<Character>(`/character/${id}`);
  return res.data;
};

export const createCharacter = async (
  data: CreateCharacterPayload
): Promise<Character> => {
  const res = await axiosClient.post<Character>("/character", data);
  return res.data;
};

export const updateCharacter = async (
  id: string,
  data: UpdateCharacterPayload
): Promise<Character> => {
  const res = await axiosClient.put<Character>(`/character/${id}`, data);
  return res.data;
};

export const deleteCharacter = async (id: string): Promise<void> => {
  await axiosClient.delete(`/character/${id}`);
};
