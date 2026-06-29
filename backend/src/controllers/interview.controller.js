const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterViewReportController(req, res) {
  try {
    let resumeText = "";

    if (req.file) {
      const mimetype = req.file.mimetype;
      const isWord = mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
                     (req.file.originalname && req.file.originalname.endsWith(".docx"));

      if (isWord) {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        resumeText = result.value;
      } else {
        // Assume PDF
        const resumeContent = await new pdfParse.PDFParse(
          Uint8Array.from(req.file.buffer),
        ).getText();
        resumeText = (typeof resumeContent === "object" && resumeContent !== null) ? (resumeContent.text || JSON.stringify(resumeContent)) : resumeContent;
      }
    }

    const { selfDescription, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required.",
      });
    }

    if (!resumeText && !selfDescription) {
      return res.status(400).json({
        message: "Either a resume or a self description is required.",
      });
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Error in generateInterViewReportController:", error);
    try {
      const fs = require("fs");
      const logMsg = `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n\n`;
      fs.appendFileSync("./error_log.txt", logMsg);
    } catch (fsErr) {
      console.error("Failed to write to local error log file:", fsErr);
    }
    res.status(500).json({
      message: "Failed to generate interview report: " + error.message,
    });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -__v -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description Controller to delete interview report by id.
 */
async function deleteInterviewReportController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    // Verify ownership
    if (interviewReport.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this report.",
      });
    }

    await interviewReportModel.findByIdAndDelete(interviewId);

    res.status(200).json({
      message: "Interview report deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteInterviewReportController:", error);
    res.status(500).json({
      message: "An error occurred while deleting the interview report.",
    });
  }
}

module.exports = { 
  generateInterViewReportController, 
  getInterviewReportByIdController, 
  getAllInterviewReportsController, 
  generateResumePdfController,
  deleteInterviewReportController
}