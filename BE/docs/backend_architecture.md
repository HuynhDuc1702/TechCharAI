# TechChar AI - Backend Architecture & Design Document

## 1. Tech Stack Overview
- **Runtime:** Node.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ORM:** Prisma
- **Future Integration:** Python (for advanced AI features, e.g., via HTTP Microservice or Message Queue)

## 2. Prisma Schema (MongoDB)
Since you are building a small-scale Character AI clone, your database needs to track Users, Characters, Chats, and Messages.

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id         String      @id @default(auto()) @map("_id") @db.ObjectId
  username   String      @unique
  email      String      @unique
  password   String      // Hashed
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  
  characters Character[] // Characters created by this user
  chats      Chat[]      // Chat sessions this user owns
}

model Character {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  description      String
  personality      String?  // System prompt / AI instructions
  greetingMessage  String
  avatarUrl        String?
  isPublic         Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  creatorId        String   @db.ObjectId
  creator          User     @relation(fields: [creatorId], references: [id])
  
  chats            Chat[]
}

model Chat {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  userId      String    @db.ObjectId
  user        User      @relation(fields: [userId], references: [id])
  
  characterId String    @db.ObjectId
  character   Character @relation(fields: [characterId], references: [id])

  messages    Message[]
}

model Message {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  text      String
  sender    SenderRole
  createdAt DateTime   @default(now())

  chatId    String     @db.ObjectId
  chat      Chat       @relation(fields: [chatId], references: [id], onDelete: Cascade)
}

enum SenderRole {
  USER
  CHARACTER
}
```

## 3. Backend Folder Structure
A clean separation of concerns using the Repository and Dependency Injection pattern.

```text
BE/
├── prisma/
│   └── schema.prisma         # Database schema mapping to MongoDB
├── src/
│   ├── config/               # Environment variables & constants
│   ├── types/
│   │   └──message.types.ts
│   ├── controllers/          # Handles HTTP requests & responses
│   │   ├── authController.ts
│   │   ├── characterController.ts
│   │   ├── chatController.ts
│   │   └── messageController.ts
│   ├── dtos/                 # Data Transfer Objects (Validation types/schemas)
│   │   ├── user.dto.ts
│   │   ├── character.dto.ts
│   │   ├── chat.dto.ts
│   │   └── message.dto.ts
│   ├── middlewares/          # Express/Fastify middlewares (Auth, Error Handler)
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── repositories/         # Database access layer (Prisma wrappers)
│   │   ├── characterRepository.ts
│   │   ├── chatRepository.ts
│   │   ├── messageRepository.ts
│   │   ├── vectorRepository.ts
│   │   └── userRepository.ts
│   ├── routes/               # API Route definitions
│   │   ├── characterRoutes.ts
│   │   ├── chatRoutes.ts
│   │   ├── messageRoutes.ts
│   │   └── userRoutes.ts
│   │   └── index.ts
│   ├── services/             # Core Business Logic
│   │   ├── authService.ts
│   │   ├── characterService.ts
│   │   ├── chatService.ts
│   │   ├── messageService.ts
│   │   ├── vectorService.ts
│   │   └── llm/
│   │       ├── llmService.ts
│   │       ├── providers/
│   │       │   ├── geminiProvider.ts
│   │       │   └── glmProvider.ts
│   ├── di/                   # Dependency Injection setup
│   │   └── container.ts      # Instantiates service and repository classes
│   ├── utils/                # Helpers (logger, password hashing, etc.)
│   ├── app.ts                # Express/Fastify app configuration
│   └── server.ts             # Application entry point
├── .env
├── package.json
└── tsconfig.json
```

## 4. Architectural Flow
1. **Route:** Receives the API request from the client.
2. **Middleware:** Validates the body using the **DTO** schema, check User authentication.
3. **Controller:** Extracts request/response objects and delegates inputs to the **Service**.
4. **Service:** Executes your business logic. 
   - *Example:* When sending a message, the `chatService` saves the User's message, then calls the `llmService` to generate the Character's reply.
5. **Repository:** Used strictly by the **Service** to query and mutate data in MongoDB via Prisma.

## 5. Development Suggestions (Small Scale Edition)
* **Dependency Injection:** Keep it simple! For a personal project, you can simply manually construct dependencies in `container.ts` or use a lightweight decorator library like `tsyringe`. Avoid overly heavy frameworks like NestJS unless you are already familiar with it.
* **DTO Validation:** Use `Zod` or `class-validator` to easily validate incoming API payloads at the router/middleware layer.
* **Preparing for Python Integration:** Don't build the Python service yet! For now, create a mock `llmService.ts` that just returns a hardcoded "Hello from AI!" response after a 1-second delay. Once you build the Python AI API later, you simply rewrite the logic inside `llmService.ts` to make an `axios` or `fetch` request, leaving the rest of your app completely untouched.
