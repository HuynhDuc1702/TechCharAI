import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";
import "./AuthPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ email, password, name });
      navigate("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Create account</h1>
          <p className="auth-card__sub">Start chatting with AI characters today</p>
        </div>

        <form id="register-form" className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__group">
            <label htmlFor="register-name" className="auth-form__label">Name <span className="auth-form__optional">(optional)</span></label>
            <input
              id="register-name"
              type="text"
              className="auth-form__input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="register-email" className="auth-form__label">Email</label>
            <input
              id="register-email"
              type="email"
              className="auth-form__input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="register-password" className="auth-form__label">Password</label>
            <input
              id="register-password"
              type="password"
              className="auth-form__input"
              placeholder="Min 6 chars, uppercase, number, symbol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-form__error">{error}</p>}

          <button
            id="register-submit-btn"
            type="submit"
            className="auth-form__submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-card__link">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
