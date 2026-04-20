# Character AI - Message Flow & Code Review

## 1. Full Message Flow (User → BE → Vector Search → LLM → Response)

The current message processing flow operates as follows:
1. **User Request**: The user sends a POST request with the message `content`, `sessionId`, and `characterId`. The `messageController.sendMessage` authenticates the user and forwards the data to `messageService.sendMessage`.
2. **MongoDB User Message Insert**: The user's message is immediately saved to the MongoDB database via Prisma, assigning it the role of `user`.
3. **Vector Semantic Search**: The backend uses HuggingFace's `Xenova/all-MiniLM-L6-v2` locally to generate a 384-dimensional vector embedding of the user's message. It queries Pinecone for the top 5 most similar previous messages in the same `sessionId`.
4. **Context Building**: The IDs returned from Pinecone are used to fetch the full message documents from MongoDB. These messages are sorted chronologically by `createdAt` to form the `messageHistory`. It also combine with the get last 10 messages from MongoDB.
5. **LLM Generation**: The system constructs a context array for the `GLM-5.1` model containing:
   - A `system` message with the explicit roleplay guidelines.
   - A `system` message with the character's details (name, personality, etc.).
   - The `messageHistory` (semantically similar past messages).
   - The user's current message.
   This payload is sent to `api.z.ai`.
6. **MongoDB AI Message Insert**: The LLM's text response is saved to MongoDB as an `assistant` message.
7. **Pinecone Vector Insert**: The user's message and the newly generated AI message are embedded and inserted sequentially into Pinecone for future retrieval.
8. **Response**: The AI's response text is returned to the user.

---

## 2. How Messages are Saved to MongoDB

Messages are saved using the Repository Pattern in `messageRepo.ts`. 
When `sendMessage` is called, Prisma creates a new record in the `Message` collection.
- The `characterId` is intentionally stripped out before saving (likely because messages belong to a `sessionId` / chat session, which inherently belongs to a character).
- MongoDB auto-generates the `_id` (mapped to `id` in Prisma) and `createdAt` timestamps.

---

## 3. How Vectors are Inserted into Pinecone

Vector insertion happens in `vectorService.ts`:
- The text is passed to the `Xenova/all-MiniLM-L6-v2` HuggingFace pipeline (`feature-extraction`), pooled, and normalized to generate a 384-dimensional floating-point array.
- This embedding is upserted into the `messages` Pinecone index.
- **Metadata**: The record includes metadata containing the raw `text` and the `sessionId`, which allows Pinecone to filter search results by session.
- **ID**: The vector record uses the same `id` as the MongoDB document to ensure parity.

---

## 4. How Context is Built and Fed to the LLM

Context is built in `llmService.ts`:
- Character details are fetched using `charService.getCharacter(characterId)`.
- A massive `systemPrompt` is defined with specific guidelines.
- The array of `messages` is structured with:
  1. System Prompt
  2. Character Details
  3. Similar Message History (from VectorDB)
  4. The Current User Message
- This is sent via `fetch` to `https://api.z.ai/api/paas/v4/chat/completions` with `model: "glm-5.1"`.





