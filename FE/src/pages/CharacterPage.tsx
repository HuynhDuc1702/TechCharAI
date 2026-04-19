import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacterById, type Character } from "../api/characterApi";
import {
  getSessionsByCharacter,
  createSession,
  type Session,
} from "../api/chatApi";
import "./CharacterPage.css";

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<Character | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Fetch character detail
  useEffect(() => {
    if (!id) return;
    getCharacterById(id)
      .then(setCharacter)
      .catch(() => setError("Character not found."))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch sessions for this character
  useEffect(() => {
    if (!id) return;
    getSessionsByCharacter(id)
      .then((data) => {
        // Sort by most recent first
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setSessions(sorted);
      })
      .catch(() => setSessions([]))
      .finally(() => setSessionsLoading(false));
  }, [id]);

  const handleNewChat = async () => {
    if (!id) return;
    setCreating(true);
    try {
      const session = await createSession(id);
      navigate(`/chat/${session.id}`);
    } catch {
      console.error("Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  const handleContinueChat = () => {
    if (sessions.length === 0) return;
    navigate(`/chat/${sessions[0].id}`);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="char-detail char-detail--not-found">
        <p>Loading…</p>
      </main>
    );
  }

  if (error || !character) {
    return (
      <main className="char-detail char-detail--not-found">
        <p>{error ?? "Character not found."}</p>
        <button className="btn btn--ghost" onClick={() => navigate("/")}>
          ← Back
        </button>
      </main>
    );
  }

  return (
    <main className="char-detail">
      <button
        className="btn btn--ghost char-detail__back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* ── Character card ─────────────────────────────────────────────── */}
      <section className="char-detail__card">
        <div className="char-detail__avatar">
          {character.avatarUrl ? (
            <img src={character.avatarUrl} alt={character.name} />
          ) : (
            character.name.charAt(0)
          )}
        </div>

        <div className="char-detail__info">
          <h1 className="char-detail__name">{character.name}</h1>
          <p className="char-detail__desc">{character.description}</p>

          <div className="char-detail__meta">
            <div className="char-detail__meta-item">
              <span className="char-detail__meta-label">Personality</span>
              <span>{character.personality}</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="char-detail__actions">
            <button
              id={`char-detail-new-chat-btn-${id}`}
              className="btn btn--primary char-detail__cta"
              onClick={handleNewChat}
              disabled={creating}
            >
              {creating ? "Starting…" : "💬 New Chat"}
            </button>

            {sessions.length > 0 && (
              <button
                id={`char-detail-continue-btn-${id}`}
                className="btn char-detail__cta char-detail__cta--ghost"
                onClick={handleContinueChat}
              >
                ▶ Continue Chat
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Sessions panel ─────────────────────────────────────────────── */}
      <aside className="char-sessions">
        <h2 className="char-sessions__title">Past Sessions</h2>

        {sessionsLoading ? (
          <p className="char-sessions__empty">Loading sessions…</p>
        ) : sessions.length === 0 ? (
          <p className="char-sessions__empty">
            No sessions yet. Start a new chat!
          </p>
        ) : (
          <ul className="char-sessions__list">
            {sessions.map((s, idx) => (
              <li key={s.id} className="char-sessions__item">
                <button
                  className="char-sessions__item-btn"
                  onClick={() => navigate(`/chat/${s.id}`)}
                >
                  <span className="char-sessions__item-label">
                    Session {sessions.length - idx}
                  </span>
                  <span className="char-sessions__item-date">
                    {formatDate(s.updatedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </main>
  );
}
