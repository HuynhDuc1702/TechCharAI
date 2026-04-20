import axiosClient from "./axiosClient";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
};

export const getMessages = async (chatId: string, page: number = 1, limit: number = 10): Promise<Message[]> => {
  const res = await axiosClient.get<Message[]>(`/message/${chatId}`, {
    params: { page, limit }
  });
  return res.data;
};

export const sendMessage = async (sessionId: string, characterId: string, content: string): Promise<string> => {
  const res = await axiosClient.post<string>(`/message/${characterId}`, {
    sessionId,
    content
  });
  return res.data;
};

export const editMessage = async (id: string, content: string): Promise<Message> => {
  const res = await axiosClient.put<Message>(`/message/${id}`, { content });
  return res.data;
};

export const deleteMessages = async (chatId: string, ids: string[]): Promise<void> => {
  await axiosClient.delete(`/message/${chatId}`, {
    data: { ids }
  });
};
