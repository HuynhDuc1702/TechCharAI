import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCharacters, type Character } from "../api/characterApi";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCharacters()
      .then(setCharacters)
      .catch(() => setError("Failed to load characters. Is the server running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* Hero */}
      <section className="home__hero">
        <h1 className="home__hero-title">
          Talk to anyone.<br />
          <span>Real or imagined.</span>
        </h1>
        <p className="home__hero-sub">
          Choose a character and start an AI-powered conversation right away.
        </p>
      </section>

      {/* Character grid */}
      <section className="home__grid-section">
        <h2 className="home__section-title">Featured Characters</h2>

        {loading && <p className="home__status">Loading characters...</p>}
        {error && <p className="home__status home__status--error">{error}</p>}

        {!loading && !error && characters.length === 0 && (
          <p className="home__status">No characters found. Add one from the backend!</p>
        )}

        <div className="home__grid">
          {characters.map((char) => (
            <article key={char.id} className="char-card" id={`char-card-${char.id}`}>
              <div className="char-card__avatar">
                {char.name.charAt(0)}
              </div>
              <div className="char-card__body">
                <h3 className="char-card__name">{char.name}</h3>
                <p className="char-card__desc">{char.description}</p>
              </div>
              <div className="char-card__actions">
                <button
                  id={`char-detail-btn-${char.id}`}
                  className="btn btn--ghost"
                  onClick={() => navigate(`/character/${char.id}`)}
                >
                  View
                </button>
                <button
                  id={`char-chat-btn-${char.id}`}
                  className="btn btn--primary"
                  onClick={() => navigate(`/chat/${char.id}`)}
                >
                  Chat
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
