import axiosClient from "./axiosClient";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Session = {
  id: string;
  userId: string;
  characterId: string;
  createdAt: string;
  updatedAt: string;
};

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * GET /chat/character/:characterId
 * Fetch all sessions for the authenticated user + a given character.
 */
export const getSessionsByCharacter = async (
  characterId: string
): Promise<Session[]> => {
  const res = await axiosClient.get<Session[]>(`/chat/character/${characterId}`);
  return res.data;
};

/**
 * GET /chat/:id
 * Fetch a single session by its ID.
 */
export const getSessionById = async (id: string): Promise<Session> => {
  const res = await axiosClient.get<Session>(`/chat/${id}`);
  return res.data;
};

/**
 * POST /chat/
 * Create a new session for the authenticated user and the given character.
 */
export const createSession = async (characterId: string): Promise<Session> => {
  const res = await axiosClient.post<Session>("/chat/", { characterId });
  return res.data;
};

/**
 * DELETE /chat/:id
 * Delete a session by ID (must be the owner).
 */
export const deleteSession = async (id: string): Promise<void> => {
  await axiosClient.delete(`/chat/${id}`);
};
