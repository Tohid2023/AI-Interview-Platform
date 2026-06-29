import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "../hooks/useInterview.js";
import "../../../style/interview.scss";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`q-card ${open ? "q-card--open" : ""}`}>
      <div className="q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
        <motion.span
          className="q-card__chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="q-card__body">
              <div className="q-card__section intention-box">
                <span className="q-card__tag q-card__tag--intention">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "4px" }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Intention
                </span>
                <p>{item.intention}</p>
              </div>
              <div className="q-card__section answer-box">
                <span className="q-card__tag q-card__tag--answer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "4px" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Model Answer
                </span>
                <p>{item.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoadMapDay = ({ day, index }) => (
  <motion.div 
    className="roadmap-day"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay: index * 0.05 }}
  >
    <div className="roadmap-day__timeline">
      <div className="roadmap-day__dot" />
    </div>
    <div className="roadmap-day__card">
      <div className="roadmap-day__header">
        <span className="roadmap-day__badge">Day {day.day}</span>
        <h3 className="roadmap-day__focus">{day.focus}</h3>
      </div>
      <ul className="roadmap-day__tasks">
        {day.tasks.map((task, i) => (
          <li key={i}>
            <svg className="task-check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="task-text">{task}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <div className="loader-container">
          <div className="loader-spinner">
            <div className="spinner-inner"></div>
          </div>
          <h1 className="loader-title">Loading Plan</h1>
          <p className="loader-subtitle">Retrieving your AI-generated preparation strategy...</p>
        </div>
      </main>
    );
  }

  const scoreColor =
    report.matchScore >= 80
      ? "score--high"
      : report.matchScore >= 60
        ? "score--mid"
        : "score--low";

  // SVG Gauge calculations
  const strokeDashoffset = 251.2 - (251.2 * (report.matchScore || 0)) / 100;

  const pageContainerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 80, damping: 15 } }
  };

  return (
    <motion.div 
      className="interview-page"
      initial="hidden"
      animate="show"
      variants={pageContainerVariants}
    >
      <motion.div className="interview-layout" variants={panelVariants}>
        {/* ── Left Nav ── */}
        <nav className="interview-nav">
          <div className="nav-content">
            <button
              onClick={() => navigate("/recent")}
              className="back-nav-btn"
              title="Back to Recent Plans"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <p className="interview-nav__label">Sections</p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${activeNav === item.id ? "interview-nav__item--active" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="interview-nav__icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => getResumePdf(interviewId)}
            className="download-pdf-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
          </button>
        </nav>

        <div className="interview-divider" />

        {/* ── Center Content ── */}
        <main className="interview-content">
          <AnimatePresence mode="wait">
            {activeNav === "technical" && (
              <motion.section
                key="technical"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h2>Technical Questions</h2>
                  <span className="content-header__count">
                    {report.technicalQuestions.length} questions
                  </span>
                </div>
                <div className="q-list">
                  {report.technicalQuestions.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} />
                  ))}
                </div>
              </motion.section>
            )}

            {activeNav === "behavioral" && (
              <motion.section
                key="behavioral"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h2>Behavioral Questions</h2>
                  <span className="content-header__count">
                    {report.behavioralQuestions.length} questions
                  </span>
                </div>
                <div className="q-list">
                  {report.behavioralQuestions.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} />
                  ))}
                </div>
              </motion.section>
            )}

            {activeNav === "roadmap" && (
              <motion.section
                key="roadmap"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h2>Preparation Road Map</h2>
                  <span className="content-header__count">
                    {report.preparationPlan.length}-day plan
                  </span>
                </div>
                <div className="roadmap-list">
                  {report.preparationPlan.map((day, idx) => (
                    <RoadMapDay key={day.day} day={day} index={idx} />
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <div className="interview-divider" />

        {/* ── Right Sidebar ── */}
        <aside className="interview-sidebar">
          {/* Match Score */}
          <div className="match-score">
            <p className="match-score__label">Match Score</p>
            <div className="match-score__gauge-wrapper">
              <svg className="match-score__svg" width="96" height="96" viewBox="0 0 100 100">
                <circle className="match-score__bg-circle" cx="50" cy="50" r="40" strokeWidth="6" />
                <motion.circle 
                  className={`match-score__fg-circle ${scoreColor}`} 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  strokeWidth="6" 
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="match-score__text">
                <span className="match-score__value">{report.matchScore}</span>
                <span className="match-score__pct">%</span>
              </div>
            </div>
            <p className="match-score__sub">
              {report.matchScore >= 80 ? "Strong match for this role" : report.matchScore >= 60 ? "Good match for this role" : "Needs preparation for this role"}
            </p>
          </div>

          <div className="sidebar-divider" />

          {/* Skill Gaps */}
          <div className="skill-gaps">
            <p className="skill-gaps__label">Skill Gaps</p>
            <div className="skill-gaps__list">
              {report.skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`skill-tag skill-tag--${gap.severity}`}
                >
                  <svg className="gap-warn-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: "4px" }}>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </motion.div>
    </motion.div>
  );
};

export default Interview;
