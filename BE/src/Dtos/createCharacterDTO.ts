export type CreateCharacterDTO = {
  name: string;
  description: string;
  personality: string;
  systemPrompt: string;
  avatarUrl?: string;
  creatorId: string;
};
