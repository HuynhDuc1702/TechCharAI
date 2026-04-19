import axiosClient from "./axiosClient";


export type Session = {
  id: string;
  userId: string;
  characterId: string;
  createdAt: string;
  updatedAt: string;
};



export const getSessionsByCharacterAndUser = async (
  characterId: string
): Promise<Session[]> => {
  const res = await axiosClient.get<Session[]>(`/chat/character/${characterId}`);
  return res.data;
};


export const getSessionById = async (id: string): Promise<Session> => {
  const res = await axiosClient.get<Session>(`/chat/${id}`);
  return res.data;
};


export const createSession = async (characterId: string): Promise<Session> => {
  const res = await axiosClient.post<Session>("/chat/", { characterId });
  return res.data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await axiosClient.delete(`/chat/${id}`);
};
