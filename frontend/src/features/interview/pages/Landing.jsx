import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import "../../../style/landing.scss";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    if (user) {
      navigate("/create");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-badge">
            <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "#ff2d78", borderRadius: "50%", marginRight: "8px" }}></span>
            Powered by Gemini AI 3.1
          </div>
          <h1>
            Conquer Your Next Tech Interview <br />
            <span className="highlight-text">With AI-Powered Precision</span>
          </h1>
          <p className="hero-subtitle">
            Upload your resume, paste a target job description, and instantly receive a highly customized prep roadmap, matching rating, and tailored questions.
          </p>
          <div className="hero-cta">
            <button onClick={handleCTA} className="pulse-btn">
              Get Started for Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>ATS Match Rating</h3>
              <p>Compare your professional credentials against any job posting to detect skill alignment, gaps, and optimize match scores.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>Curated Questions</h3>
              <p>Generate highly realistic technical and behavioral questions designed specifically around your skills and the target role.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
              </div>
              <h3>Structured Roadmap</h3>
              <p>Follow a structured, day-by-day learning curriculum designed by AI to quickly bridge critical skill gaps and prepare you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mock Preview */}
      <section className="preview-section">
        <div className="container">
          <div className="preview-container">
            <div className="preview-header">
              <div className="brand">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                <span>Mock Strategy Preview</span>
              </div>
              <span className="status-badge">Ready</span>
            </div>

            <div className="preview-body">
              <div className="preview-main">
                <div className="preview-question-card">
                  <h4>Q1: Explain virtual DOM rendering in React.</h4>
                  <p><strong>Intention:</strong> Tests core understanding of React reconciliation algorithms and diffing processes.</p>
                </div>
                <div className="preview-question-card">
                  <h4>Q2: How do you optimize Node.js database pools?</h4>
                  <p><strong>Intention:</strong> Validates experience in high-concurrency systems and connection scaling limits.</p>
                </div>
              </div>

              <div className="preview-sidebar">
                <div className="score-circle">
                  <span className="score-val">87%</span>
                  <span className="score-lbl">Match</span>
                </div>
                <div className="gap-list">
                  <div className="gap-item">
                    <span>Docker / Containers</span>
                    <span className="gap-severity">High</span>
                  </div>
                  <div className="gap-item">
                    <span>Redis Caching</span>
                    <span className="gap-severity">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
