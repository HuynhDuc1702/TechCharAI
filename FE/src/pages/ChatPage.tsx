import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSessionById, type Session } from "../api/chatApi";
import MessageBubble from "../components/MessageBubble";
import "./ChatPage.css";

interface MockMessage {
  id: string;
  role: "user" | "character";
  text: string;
  timestamp: string;
}

const MOCK_MESSAGES: MockMessage[] = [
  {
    id: "1",
    role: "character",
    text: "Hello, traveller. I've been expecting you. What brings you to my domain?",
    timestamp: "15:30",
  },
  {
    id: "2",
    role: "user",
    text: "I heard whispers of a great power hidden in these lands. I seek your guidance.",
    timestamp: "15:31",
  },
  {
    id: "3",
    role: "character",
    text: "Ah, power. An elusive thing, isn't it? Many have come seeking it, yet few understand what it truly means to wield it. Tell me — what would you do if you found it?",
    timestamp: "15:31",
  },
  {
    id: "4",
    role: "user",
    text: "I'd use it to protect the ones I care about. Nothing more.",
    timestamp: "15:32",
  },
  {
    id: "5",
    role: "character",
    text: "A noble answer. Perhaps the most honest I've heard in centuries. Very well, I shall help you. But know this — every choice carries a price.",
    timestamp: "15:32",
  },
  {
    id: "6",
    role: "user",
    text: "I understand. I'm ready.",
    timestamp: "15:33",
  },
];



export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [aiTemp, setAiTemp] = useState(0.7);
  const [creativeMode, setCreativeMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;
    getSessionById(sessionId)
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [sessionId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const handleSend = () => {
    console.log("Send:", inputText);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEditLastMessage = () => {
    console.log("Edit last user message");
  };

  const handleEditMessage = (id: string) => {
    console.log("Edit message", id);
  };

  const handleDeleteMessage = (id: string) => {
    console.log("Delete message", id);
  };

  const characterName = loading
    ? "Loading…"
    : session
      ? "Character"
      : "Unknown";

  const characterInitial = characterName.charAt(0).toUpperCase();

  return (
    <div className={`chat-page ${isSidebarOpen ? "" : "chat-page--sidebar-closed"}`}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {isSidebarOpen && (
        <aside className="chat-sidebar">
          {/* Close Sidebar Button for Mobile/Desktop */}
          <button 
            className="chat-sidebar__close-btn"
            onClick={() => setIsSidebarOpen(false)}
            title="Close sidebar"
          >
            ×
          </button>

          {/* Character section */}
        <div className="chat-sidebar__char">
          <div className="chat-sidebar__avatar">{characterInitial}</div>
          <h2 className="chat-sidebar__char-name">{characterName}</h2>
          <p className="chat-sidebar__char-sub">Session active</p>

          <button
            className="chat-sidebar__back-btn"
            onClick={() =>
              session
                ? navigate(`/character/${session.characterId}`)
                : navigate(-1)
            }
          >
            ← Back to profile
          </button>
        </div>

        {/* Divider */}
        <div className="chat-sidebar__divider" />

        {/* AI Config placeholder */}
        <div className="chat-sidebar__config">
          <h3 className="chat-sidebar__config-title">⚙ AI Settings</h3>
          <p className="chat-sidebar__config-hint">
            Fine-tune behaviour for this session.
          </p>

          {/* Temperature */}
          <div className="chat-sidebar__control">
            <label className="chat-sidebar__control-label" htmlFor="ai-temp">
              Temperature
              <span className="chat-sidebar__control-value">
                {aiTemp.toFixed(1)}
              </span>
            </label>
            <input
              id="ai-temp"
              className="chat-sidebar__slider"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={aiTemp}
              onChange={(e) => setAiTemp(parseFloat(e.target.value))}
            />
          </div>

          {/* Creative mode toggle */}
          <div className="chat-sidebar__control chat-sidebar__control--row">
            <label
              className="chat-sidebar__control-label"
              htmlFor="creative-mode"
            >
              Creative Mode
            </label>
            <button
              id="creative-mode"
              role="switch"
              aria-checked={creativeMode}
              className={`chat-sidebar__toggle ${creativeMode ? "chat-sidebar__toggle--on" : ""
                }`}
              onClick={() => setCreativeMode((v) => !v)}
            >
              <span className="chat-sidebar__toggle-thumb" />
            </button>
          </div>

          {/* Placeholder badges */}
          <div className="chat-sidebar__config-badges">
            <span className="chat-sidebar__badge">Memory</span>
            <span className="chat-sidebar__badge">Persona</span>
            <span className="chat-sidebar__badge chat-sidebar__badge--locked">
              🔒 Voice
            </span>
          </div>
        </div>
      </aside>
      )}

      {/* ── Main chat area ───────────────────────────────────────────────── */}
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <div className="chat-header__left">
            <div className="chat-header__avatar">{characterInitial}</div>
            <div>
              <h1 className="chat-header__name">{characterName}</h1>
              <span className="chat-header__status">● Online</span>
            </div>
          </div>
          <div className="chat-header__right">
            <button
              className={`chat-header__icon-btn ${isSidebarOpen ? "chat-header__icon-btn--active" : ""}`}
              title="Toggle sidebar"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ⚙
            </button>
          </div>
        </header>

        {/* Messages */}
        <section className="chat-messages" aria-label="Conversation">
          {loading ? (
            <div className="chat-messages__loading">Loading session…</div>
          ) : (
            <>
              {MOCK_MESSAGES.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  text={msg.text}
                  senderName={msg.role === "character" ? characterName : "You"}
                  timestamp={msg.timestamp}
                  onEdit={msg.role === "user" ? () => handleEditMessage(msg.id) : undefined}
                  onDelete={() => handleDeleteMessage(msg.id)}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </section>

        {/* Input bar */}
        <footer className="chat-input">
          <div className="chat-input__bar">
            <textarea
              id="chat-message-input"
              className="chat-input__textarea"
              placeholder={`Message ${characterName}…`}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="chat-input__actions">
              <button
                className="chat-input__icon-btn"
                title="Edit last message"
                onClick={handleEditLastMessage}
              >
                ✏
              </button>
              <button
                id="chat-send-btn"
                className="chat-input__send-btn"
                onClick={handleSend}
                disabled={!inputText.trim()}
              >
                ➤
              </button>
            </div>
          </div>
          <p className="chat-input__hint">
            Shift + Enter for a new line · Enter to send
          </p>
        </footer>
      </main>
    </div>
  );
}
