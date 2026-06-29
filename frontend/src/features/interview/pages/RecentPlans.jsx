import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.js";
import { motion } from "framer-motion";
import "../../../style/recent.scss";

const RecentPlans = () => {
  const { loading, reports, deleteReport } = useInterview();
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently delete this interview plan?")) {
      await deleteReport(id);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "high";
    if (score >= 60) return "mid";
    return "low";
  };

  const truncateText = (text, maxLength = 140) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  return (
    <motion.div 
      className="recent-plans-page"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <div className="dashboard-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/create")}
            className="back-icon-btn"
            title="Back to Dashboard"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 style={{ margin: 0 }}>My Recent Plans</h2>
        </div>
        <button
          onClick={() => navigate("/create-plan")}
          className="create-plan-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your interview plans...</p>
        </div>
      ) : reports.length === 0 ? (
        <motion.div 
          className="empty-state"
          variants={itemVariants}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff3b8d"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M21 12H3" />
            <path d="M12 3v18" />
          </svg>
          <h3>No reports found</h3>
          <p>Create your first custom interview strategy to get started.</p>
          <button
            onClick={() => navigate("/create-plan")}
            className="get-started-btn"
          >
            Get Started
          </button>
        </motion.div>
      ) : (
        <motion.ul className="plans-grid" variants={containerVariants}>
          {reports.map((report) => {
            const scoreClass = getScoreClass(report.matchScore || 0);
            const totalQuestions = (report.technicalQuestions?.length || 0) + (report.behavioralQuestions?.length || 0);
            
            return (
              <motion.li
                key={report._id}
                className={`plan-card border-${scoreClass}`}
                variants={itemVariants}
                onClick={() => navigate(`/interview/${report._id}`)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="card-header">
                  <div className="header-left">
                    <div className={`icon-container icon-${scoreClass}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="title-section">
                      <h3>{report.title || "Untitled Plan"}</h3>
                      <div className="date-text">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, report._id)}
                    className="delete-card-btn"
                    title="Delete Plan"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>

                <p className="card-description">
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
                    </svg>
                    <span>Gaps: <strong>{report.skillGaps?.length || 0}</strong></span>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default RecentPlans;
