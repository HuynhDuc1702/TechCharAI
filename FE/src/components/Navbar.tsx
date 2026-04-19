import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo">
        ✦ TechChar<span>AI</span>
      </Link>

      <nav className="navbar__links">
        <Link to="/">Home</Link>
      </nav>

      {isLoggedIn ? (
        <div className="navbar__profile">
          <button
            id="navbar-profile-btn"
            className="navbar__avatar"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-label="Profile menu"
          >
            👤
          </button>

          {dropdownOpen && (
            <>

              <div className="navbar__dropdown-overlay" onClick={() => setDropdownOpen(false)} />
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-user">
                  <div className="navbar__dropdown-avatar">👤</div>
                  <span className="navbar__dropdown-label">My Account</span>
                </div>
                <hr className="navbar__dropdown-divider" />
                <button
                  id="navbar-my-character-btn"
                  className="navbar__login-btn"
                  onClick={() => navigate("/my-characters")}
                >
                  My Character
                </button>
                <button
                  id="navbar-logout-btn"
                  className="navbar__dropdown-item navbar__dropdown-item--danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            </>
          )}
        </div>
      ) : (
        <button
          id="navbar-login-btn"
          className="navbar__login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </header>
  );
}

