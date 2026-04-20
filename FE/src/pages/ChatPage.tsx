import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSessionById, type Session } from "../api/sessionApi";
import { getCharacterById, type Character } from "../api/characterApi";
import { getMessages, sendMessage, editMessage, deleteMessages, type Message } from "../api/messageApi";
import MessageBubble from "../components/MessageBubble";
import "./ChatPage.css";

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [aiTemp, setAiTemp] = useState(0.7);
  const [creativeMode, setCreativeMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 3000);
  };

  useEffect(() => {
    if (!sessionId) return;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const sessionData = await getSessionById(sessionId);
        setSession(sessionData);

        const [charData, msgs] = await Promise.all([
          getCharacterById(sessionData.characterId),
          getMessages(sessionId, 1, 10)
        ]);

        setCharacter(charData);
        setMessages(msgs);
        if (msgs.length < 10) setHasMore(false);
        setPage(1);

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 100);
      } catch (err) {
        console.error("Failed to load chat data", err);
        showError("Failed to load session data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [sessionId]);

  const handleScroll = async () => {
    if (!messagesContainerRef.current || loadingMore || !hasMore || loading) return;

    if (messagesContainerRef.current.scrollTop === 0) {
      setLoadingMore(true);
      const prevScrollHeight = messagesContainerRef.current.scrollHeight;

      try {
        const nextMsgs = await getMessages(sessionId!, page + 1, 10);
        if (nextMsgs.length > 0) {
          setMessages(prev => [...nextMsgs, ...prev]);
          setPage(prev => prev + 1);
          if (nextMsgs.length < 10) setHasMore(false);

          setTimeout(() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - prevScrollHeight;
            }
          }, 0);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load older messages", err);
        showError("Failed to load older messages.");
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !sessionId || !character || isThinking) return;

    const content = inputText.trim();
    const tempUserId = `temp-${Date.now()}`;
    const newMsg: Message = {
      id: tempUserId,
      role: "user",
      content,
      sessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setIsThinking(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 10);

    try {
      await sendMessage(sessionId, character.id, content);

      const latestMsgs = await getMessages(sessionId, 1, 10);

      setMessages(prev => {
        const oldMessages = prev.filter(m => !latestMsgs.find(lm => lm.id === m.id) && m.id !== tempUserId);
        return [...oldMessages, ...latestMsgs];
      });

    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => prev.filter(m => m.id !== tempUserId));
      setInputText(content);
      showError("Failed to send message.");
    } finally {
      setIsThinking(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 10);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleEditMessage = async (id: string, newText: string) => {
    try {
      await editMessage(id, newText);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, content: newText } : m));
    } catch (err) {
      console.error("Failed to edit message", err);
      showError("Failed to edit message.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return;

    const msgsToDelete = messages.slice(index);
    const idsToDelete = msgsToDelete.map(m => m.id);

    setMessages(prev => prev.slice(0, index));

    try {
      if (sessionId) {
        await deleteMessages(sessionId, idsToDelete);
      }
    } catch (err) {
      console.error("Failed to delete messages", err);
      setMessages(prev => [...prev, ...msgsToDelete]);
      showError("Failed to delete messages.");
    }
  };

  const handleEditLastMessage = () => {
    const lastUserMsgIndex = [...messages].reverse().findIndex(m => m.role === "user");
    if (lastUserMsgIndex !== -1) {
      const actualIndex = messages.length - 1 - lastUserMsgIndex;
      const msg = messages[actualIndex];
      setInputText(msg.content);
      if (textareaRef.current) {
        textareaRef.current.focus();
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
          }
        }, 0);
      }
    }
  };

  const characterName = loading ? "Loading…" : character ? character.name : "Unknown";
  const characterInitial = characterName.charAt(0).toUpperCase();

  return (
    <div className={`chat-page ${isSidebarOpen ? "" : "chat-page--sidebar-closed"}`}>
      {errorToast && <div className="chat-toast">{errorToast}</div>}

      <aside className="chat-sidebar">
        <button
          className="chat-sidebar__close-btn"
          onClick={() => setIsSidebarOpen(false)}
          title="Close sidebar"
        >
          ×
        </button>

        <div className="chat-sidebar__char">
          {character?.avatarUrl ? (
            <div className="chat-sidebar__avatar">
              <img src={character.avatarUrl} alt={characterName} className="chat-sidebar__avatar-img" />
            </div>
          ) : (
            <div className="chat-sidebar__avatar">{characterInitial}</div>
          )}
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

        <div className="chat-sidebar__divider" />

        <div className="chat-sidebar__config">
          <h3 className="chat-sidebar__config-title">⚙ AI Settings</h3>
          <p className="chat-sidebar__config-hint">
            Fine-tune behaviour for this session.
          </p>

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
              className={`chat-sidebar__toggle ${creativeMode ? "chat-sidebar__toggle--on" : ""}`}
              onClick={() => setCreativeMode((v) => !v)}
            >
              <span className="chat-sidebar__toggle-thumb" />
            </button>
          </div>

          <div className="chat-sidebar__config-badges">
            <span className="chat-sidebar__badge">Memory</span>
            <span className="chat-sidebar__badge">Persona</span>
            <span className="chat-sidebar__badge chat-sidebar__badge--locked">
              🔒 Voice
            </span>
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div className="chat-header__left">
            {character?.avatarUrl ? (
              <img src={character.avatarUrl} alt={characterName} className="chat-header__avatar" />
            ) : (
              <div className="chat-header__avatar">{characterInitial}</div>
            )}
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

        <section
          className="chat-messages"
          aria-label="Conversation"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {loading ? (
            <div className="chat-messages__loading">Loading session…</div>
          ) : (
            <>
              {loadingMore && <div className="chat-messages__load-more">Loading older messages…</div>}
              {messages.length === 0 && !isThinking && (
                <div className="chat-messages__empty">No messages yet. Start the conversation!</div>
              )}
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  text={msg.content}
                  senderName={msg.role === "assistant" ? characterName : "You"}
                  timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  onEdit={(newText) => handleEditMessage(msg.id, newText)}
                  onDelete={() => handleDeleteMessage(msg.id)}
                />
              ))}
              {isThinking && (
                <MessageBubble
                  role="assistant"
                  text=""
                  senderName={characterName}
                  isTyping={true}
                />
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </section>

        <footer className="chat-input">
          <div className="chat-input__bar">
            <textarea
              id="chat-message-input"
              ref={textareaRef}
              className="chat-input__textarea"
              placeholder={`Message ${characterName}…`}
              rows={1}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isThinking}
            />
            <div className="chat-input__actions">
              <button
                className="chat-input__icon-btn"
                title="Use last message text"
                onClick={handleEditLastMessage}
                disabled={isThinking || messages.length === 0}
              >
                ✏
              </button>
              <button
                id="chat-send-btn"
                className="chat-input__send-btn"
                onClick={handleSend}
                disabled={!inputText.trim() || isThinking}
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
