import { useState, useRef, useEffect } from 'react'
import "../../../style/home.scss";
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'

const StrategyLoader = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        "Analyzing job description and requirements...",
        "Evaluating candidate profile matching...",
        "Identifying technology stack alignments...",
        "Synthesizing customized technical questions...",
        "Generating behavioral scenarios and answers...",
        "Formulating preparation roadmap & strategy..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 2200);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <main className='loading-screen'>
            <div className="loader-container">
                <div className="loader-spinner">
                    <div className="spinner-inner"></div>
                </div>
                <h1 className="loader-title">Generating Your Strategy</h1>
                <p className="loader-subtitle">Our AI is analyzing the job description and your profile to craft a customized preparation plan...</p>
                <div className="loader-steps">
                    {steps.map((step, idx) => {
                        let status = "upcoming";
                        if (idx < currentStep) status = "completed";
                        else if (idx === currentStep) status = "active";

                        return (
                            <div key={idx} className={`loader-step ${status}`}>
                                <div className="step-icon">
                                    {status === "completed" ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'block' }}>
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : status === "active" ? (
                                        <div className="pulse-dot"></div>
                                    ) : (
                                        <div className="dot"></div>
                                    )}
                                </div>
                                <span className="step-text">{step}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

const Home = () => {
    const { loading, generateReport } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ uploadedFile, setUploadedFile ] = useState(null)
    const [ isDragging, setIsDragging ] = useState(false)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.")
                return
            }
            setUploadedFile(file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files && files[0]) {
            const file = files[0]
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.")
                return
            }
            const name = file.name.toLowerCase()
            if (name.endsWith(".pdf") || name.endsWith(".docx")) {
                setUploadedFile(file)
                if (resumeInputRef.current) {
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(file)
                    resumeInputRef.current.files = dataTransfer.files
                }
            } else {
                alert("Only PDF or DOCX files are allowed.")
            }
        }
    }

    const handleRemoveFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setUploadedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleGenerateReport = async () => {
        if (!jobDescription.trim()) {
            alert("Please enter target job description.")
            return
        }
        if (!uploadedFile && !selfDescription.trim()) {
            alert("Please upload a resume or provide a quick self-description.")
            return
        }

        const data = await generateReport({ jobDescription, selfDescription, resumeFile: uploadedFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        } else {
            alert("Failed to generate interview strategy. Please verify your inputs and try again.")
        }
    }

    const isFormValid = jobDescription.trim().length > 0 && (uploadedFile !== null || selfDescription.trim().length > 0)

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
        return <StrategyLoader />
    }

    return (
        <motion.div 
            className="home-page"
            initial="hidden"
            animate="show"
            variants={containerVariants}
            style={{ paddingTop: "2rem" }}
        >

            {/* 4. Creator Form Container */}
            <motion.div className="create-plan-layout" variants={itemVariants}>
                {/* Left - Creator Form */}
                <div className="form-panel">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/create")}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#7d8590",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            marginBottom: "1rem",
                            transition: "color 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#ff3b8d"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#7d8590"}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Dashboard
                    </button>

                    {/* Job Description Textarea */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3>Target Job Description</h3>
                            <span className="required-badge">Required</span>
                        </div>
                        <div className="input-wrapper">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job requirements description here (e.g. Senior React Developer role details...)"
                                maxLength={5000}
                            />
                            <div className="char-counter">{jobDescription.length} / 5000 chars</div>
                        </div>
                    </div>

                    {/* Side-by-side Upload & Self Description */}
                    <div className="form-grid-row">
                        {/* Resume Upload dropzone */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Upload Resume</h3>
                                <span className="required-badge" style={{ color: "#4caf50", backgroundColor: "rgba(76, 175, 80, 0.1)", borderColor: "rgba(76, 175, 80, 0.2)" }}>Best Results</span>
                            </div>

                            {uploadedFile ? (
                                <motion.div 
                                    className="file-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ height: "100%", minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "center" }}
                                >
                                    <div className="file-info">
                                        <div className="file-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                            </svg>
                                        </div>
                                        <div className="file-meta">
                                            <span className="name" title={uploadedFile.name}>{uploadedFile.name}</span>
                                            <span className="size">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                    <div className="file-actions">
                                        <span className="badge">Ready</span>
                                        <button 
                                            type="button" 
                                            className="remove-btn" 
                                            onClick={handleRemoveFile}
                                            title="Remove file"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <label 
                                    className={`dropzone ${isDragging ? 'dragging' : ''}`}
                                    htmlFor="resume"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    style={{ height: "100%", minHeight: "180px" }}
                                >
                                    <div className="dropzone-icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                    </div>
                                    <p>Click to upload or drag &amp; drop</p>
                                    <span className="subtitle">PDF or DOCX (Max 5MB)</span>
                                    <input 
                                        ref={resumeInputRef} 
                                        hidden 
                                        type='file' 
                                        id='resume' 
                                        name='resume' 
                                        accept='.pdf,.docx' 
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Quick Self-Description */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Quick Self-Description</h3>
                                <span className="required-badge" style={{ color: "#9ca3af", backgroundColor: "rgba(156, 163, 175, 0.1)", borderColor: "rgba(156, 163, 175, 0.2)" }}>Alternative</span>
                            </div>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                className="short-desc"
                                placeholder="Describe your tech stack, projects, and background experience if you don't have a resume handy..."
                                style={{ height: "100%", minHeight: "180px", resize: "none" }}
                            />
                        </div>
                    </div>

                    {/* Generate Button wrapper */}
                    <div className="generate-btn-wrapper">
                        <button
                            onClick={handleGenerateReport}
                            className="gradient-generate-btn"
                            disabled={!isFormValid}
                        >
                            <svg className="sparkle-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                            ✨ Generate Interview Strategy
                        </button>
                    </div>
                </div>
            </motion.div>

        </motion.div>
    )
}

export default Home;
