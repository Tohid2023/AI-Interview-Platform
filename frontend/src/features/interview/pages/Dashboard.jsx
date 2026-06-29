import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { motion } from 'framer-motion'
import "../../../style/home.scss";

const Dashboard = () => {
    const { reports, loading } = useInterview()
    const { user } = useAuth()
    const navigate = useNavigate()
    const displayName = user?.username || user?.email?.split("@")[0] || "Tohid"

    // Statistics calculations
    const totalPlans = (reports || []).length
    const avgScore = totalPlans > 0
        ? Math.round(reports.reduce((acc, r) => acc + (r.matchScore || 0), 0) / totalPlans)
        : 0
    const lastReport = reports && reports[0] ? reports[0] : null

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className="loader-container">
                    <div className="loader-spinner">
                        <div className="spinner-inner"></div>
                    </div>
                    <h1 className="loader-title">Loading Dashboard</h1>
                    <p className="loader-subtitle">Loading your stats and plan data...</p>
                </div>
            </main>
        )
    }

    return (
        <motion.div 
            className="home-page"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            {/* 1. Welcome Section */}
            <motion.div className="welcome-section" variants={itemVariants}>
                <h1>Welcome back, {displayName} 👋</h1>
                <p>Generate AI-powered interview strategies tailored to every job.</p>
            </motion.div>

            {/* 2. Statistics Grid */}
            <motion.div className="stats-grid" variants={itemVariants}>
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Total Plans</span>
                        <span className="stat-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        </span>
                    </div>
                    <div className="stat-value">{totalPlans}</div>
                    <div className="stat-meta">Custom strategies built</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <span>Avg Match Score</span>
                        <span className="stat-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"></path>
                            </svg>
                        </span>
                    </div>
                    <div className="stat-value">{avgScore}%</div>
                    <div className="stat-meta">Across all applications</div>
                </div>

                <div 
                    className="stat-card"
                    onClick={() => lastReport && navigate(`/interview/${lastReport._id}`)}
                >
                    <div className="stat-header">
                        <span>Last Generated Plan</span>
                        <span className="stat-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </span>
                    </div>
                    <div className="stat-value" style={{ fontSize: lastReport ? "1.1rem" : "2rem", fontWeight: lastReport ? "700" : "800", height: "40px", display: "flex", alignItems: "center", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {lastReport ? lastReport.title : "None"}
                    </div>
                    <div className="stat-meta">
                        {lastReport ? `Created on ${new Date(lastReport.createdAt).toLocaleDateString()}` : "No plans generated yet"}
                    </div>
                </div>
            </motion.div>

            {/* 3. Workflow Steps */}
            <motion.div className="workflow-steps" variants={itemVariants}>
                <div className="step-item active">
                    <span className="step-num">1</span>
                    <span>Paste Job Description</span>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                    <span className="step-num">2</span>
                    <span>Upload Resume</span>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                    <span className="step-num">3</span>
                    <span>AI Analysis</span>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                    <span className="step-num">4</span>
                    <span>Interview Report</span>
                </div>
            </motion.div>

            {/* 4. Split Dashboard Layout */}
            <motion.div className="dashboard-layout" variants={itemVariants}>
                {/* Left - Ready Card */}
                <div 
                    className="form-panel"
                    style={{ alignItems: "center", justifyContent: "center", minHeight: "360px", textAlign: "center", gap: "1.75rem" }}
                >
                    <div style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 59, 141, 0.1)",
                        color: "#ff3b8d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto"
                    }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#f3f4f6", margin: "0" }}>Ready to Prepare?</h3>
                        <p style={{ fontSize: "0.9rem", color: "#9ca3af", maxWidth: "340px", margin: "0 auto", lineHeight: "1.6" }}>
                            Launch a new custom strategy generation by providing your target job description and profile credentials.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate("/create-plan")} 
                        className="gradient-generate-btn"
                        style={{ maxWidth: "260px", margin: "0 auto" }}
                    >
                        ✨ Create Interview Plan
                    </button>
                </div>

                {/* Right - AI Informative Sidebar */}
                <div className="sidebar-panel">
                    <div className="info-card">
                        <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "4px" }}>
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            AI Strategy Engine
                        </h3>
                        <div className="process-list">
                            <div className="process-item">
                                <span className="bullet">1</span>
                                <div className="content">
                                    <h4>Profile Analysis</h4>
                                    <p>Extracts technical focus areas and keywords from your resume or self description.</p>
                                </div>
                            </div>
                            <div className="process-item">
                                <span className="bullet">2</span>
                                <div className="content">
                                    <h4>ATS Match Check</h4>
                                    <p>Calculates match percentages between your profile and target job requirements.</p>
                                </div>
                            </div>
                            <div className="process-item">
                                <span className="bullet">3</span>
                                <div className="content">
                                    <h4>Question Curation</h4>
                                    <p>Generates target questions with technical intentions and ideal answer criteria.</p>
                                </div>
                            </div>
                            <div className="process-item">
                                <span className="bullet">4</span>
                                <div className="content">
                                    <h4>Skill Gap Mapping</h4>
                                    <p>Identifies crucial technologies missing from your profile based on job rules.</p>
                                </div>
                            </div>
                            <div className="process-item">
                                <span className="bullet">5</span>
                                <div className="content">
                                    <h4>Custom Preparation Plan</h4>
                                    <p>Synthesizes a structured daily learning roadmap to get you fully interview-ready.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Dashboard;
