# Frontend Architecture

A simple personal-project React + Vite + TypeScript frontend for the Character AI clone.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Language | TypeScript |
| Routing | React Router v6 |
| HTTP client | Axios |
| State | React Context + `useState` (no Redux, keep it simple) |
| Styling | CSS Modules or plain CSS |

---

## Folder Structure

```
FE/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── main.tsx             # App entry point
│   ├── App.tsx              # Root component, router setup
│   ├── index.css            # Global styles
│   │
│   ├── pages/               # One folder per route/page
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── HomePage.tsx         # Character listing
│   │   ├── CharacterPage.tsx    # Single character detail
│   │   └── ChatPage.tsx         # Chat UI with a character
│   │
│   ├── components/          # Reusable UI pieces
│   │   ├── Navbar.tsx
│   │   ├── CharacterCard.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ProtectedRoute.tsx   # Wraps routes that need auth
│   │
│   ├── context/             # Global state via React Context
│   │   └── AuthContext.tsx      # Holds accessToken in memory, user info
│   │
│   ├── api/                 # Axios instances and API call functions
│   │   ├── axiosClient.ts       # Base Axios instance + interceptors
│   │   ├── authApi.ts           # login, register, refresh, logout
│   │   ├── characterApi.ts      # CRUD for characters
│   │   └── chatApi.ts           # Session and message calls
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts           # Shortcut to consume AuthContext
│   │   └── useRefreshToken.ts   # Calls /auth/refresh on page load
│   │
│   └── types/               # Shared TypeScript types/interfaces
│       ├── character.ts
│       ├── user.ts
│       └── chat.ts
│
├── index.html
├── vite.config.ts
└── tsconfig.json
```

---

## Key Conventions

### Auth Flow
- `accessToken` is stored **in memory** (inside `AuthContext`) — never in `localStorage`.
- `refreshToken` lives in an `HttpOnly` cookie set by the BE — JS never touches it directly.
- On app load, `useRefreshToken` hook calls `GET /auth/refresh`. If the cookie is valid, a new `accessToken` is returned and saved to context. If not, the user is redirected to `/login`.

### Axios Interceptors (`axiosClient.ts`)
- **Request interceptor:** Attaches `Authorization: Bearer <accessToken>` to every request.
- **Response interceptor:** On `401`, automatically calls `/auth/refresh`, updates the token in context, then retries the original request once.

### Protected Routes (`ProtectedRoute.tsx`)
- Wraps any route that requires login.
- Checks `AuthContext` for a valid `accessToken`; redirects to `/login` if missing.

### API Layer (`api/`)
- All BE calls live here — pages and components never call Axios directly.
- Each file groups calls by domain (auth, character, chat).

---

## Pages & Routes

| Path | Page | Auth Required |
|---|---|---|
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `/` | `HomePage` | Yes |
| `/character/:id` | `CharacterPage` | Yes |
| `/chat/:characterId` | `ChatPage` | Yes |
