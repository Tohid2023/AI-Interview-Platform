import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../style/layout.scss";

const Layout = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      navigate("/", { replace: true });
      setTimeout(async () => {
        await handleLogout();
      }, 150);
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const displayName = user?.username || user?.email?.split("@")[0] || "User";

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to={user ? "/create" : "/"} className="navbar-logo">
            <svg
              className="logo-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <span className="logo-text">Interview<span className="logo-highlight">AI</span></span>
          </Link>

          <nav className="navbar-menu">
            {user ? (
              <>
                <Link to="/create-plan" className="menu-link">Create Plan</Link>
                <Link to="/recent" className="menu-link">Recent Plans</Link>
              </>
            ) : (
              <>
                <a href="#features" className="menu-link" onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(".features-section")?.scrollIntoView({ behavior: "smooth" });
                }}>Features</a>
                <a href="#preview" className="menu-link" onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(".preview-section")?.scrollIntoView({ behavior: "smooth" });
                }}>Preview</a>
              </>
            )}
          </nav>

          <div className="navbar-actions">
            {user ? (
              <>
                <div className="user-profile">
                  <div className="avatar">{getInitials(displayName)}</div>
                  <span className="username">{displayName}</span>
                </div>
                <button onClick={handleLogoutClick} className="logout-button" title="Logout">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="menu-link" style={{ marginRight: "1rem" }}>Login</Link>
                <Link to="/register" className="button primary-button" style={{ 
                  background: "linear-gradient(135deg, #ff2d78 0%, #d91c5c 100%)", 
                  color: "#fff", 
                  textDecoration: "none", 
                  padding: "0.5rem 1.2rem", 
                  borderRadius: "0.375rem", 
                  fontWeight: "600" 
                }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p className="copyright">
            &copy; {new Date().getFullYear()} InterviewAI. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
