import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";
import "../../../style/recent.scss";

const RecentPlans = () => {
  const { loading, reports } = useInterview();
  const navigate = useNavigate();

  const getScoreClass = (score) => {
    if (score >= 80) return "high";
    if (score >= 60) return "mid";
    return "low";
  };

  const truncateText = (text, maxLength = 140) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="recent-plans-page">
      <div className="dashboard-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/create")}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #2a3348",
              color: "#e6edf3",
              width: "36px",
              height: "36px",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#ff2d78";
              e.currentTarget.style.color = "#ff2d78";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#2a3348";
              e.currentTarget.style.color = "#e6edf3";
            }}
            title="Back to Create Plan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 style={{ margin: 0 }}>My Recent Interview Plans</h2>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="button secondary-button"
          style={{
            backgroundColor: "transparent",
            border: "1px solid #2a3348",
            color: "#e6edf3",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "600",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "#ff2d78";
            e.currentTarget.style.backgroundColor = "rgba(255, 45, 120, 0.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#2a3348";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Create New Plan
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <div className="spinner" style={{ margin: "0 auto 1.5rem" }}></div>
          <p style={{ color: "#7d8590" }}>Loading your plans...</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "5rem 2rem",
          backgroundColor: "#161b22",
          border: "1px solid #2a3348",
          borderRadius: "1rem"
        }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7d8590"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: "1.25rem" }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M21 12H3" />
            <path d="M12 3v18" />
          </svg>
          <h3 style={{ color: "#e6edf3", marginBottom: "0.5rem" }}>No reports found</h3>
          <p style={{ color: "#7d8590", marginBottom: "1.5rem" }}>Create your first custom interview strategy to get started.</p>
          <button
            onClick={() => navigate("/create")}
            className="button primary-button"
            style={{
              background: "linear-gradient(135deg, #ff2d78 0%, #d91c5c 100%)",
              color: "#fff",
              border: "none",
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Get Started
          </button>
        </div>
      ) : (
        <ul className="plans-grid">
          {reports.map((report) => {
            const scoreClass = getScoreClass(report.matchScore || 0);
            const totalQuestions = (report.technicalQuestions?.length || 0) + (report.behavioralQuestions?.length || 0);
            
            return (
              <li
                key={report._id}
                className="plan-card"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="card-header">
                  <div className="icon-container">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  </div>
                  <div className="title-section">
                    <h3>{report.title || "Untitled Plan"}</h3>
                    <div className="date-text">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "2px" }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <p style={{
                  fontSize: "0.85rem",
                  color: "#7d8590",
                  margin: "0",
                  lineHeight: "1.6",
                  textAlign: "left",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}>
                  {truncateText(report.jobDescription)}
                </p>

                <div className="match-section">
                  <div className="match-label-row">
                    <span className="label">Job Match Rating</span>
                    <span className={`value ${scoreClass}`}>{report.matchScore || 0}% Match</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className={`progress-bar-fill ${scoreClass}`} style={{ width: `${report.matchScore || 0}%` }}></div>
                  </div>
                </div>

                <div className="details-row">
                  <div className="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>Questions: <strong>{totalQuestions}</strong></span>
                  </div>
                  <div className="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>Gaps: <strong>{report.skillGaps?.length || 0}</strong></span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentPlans;
