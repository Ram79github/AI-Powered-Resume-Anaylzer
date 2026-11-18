import * as reportService from '../services/reports.js';
import { analyzeResume } from '../utils/analyzer.js';
import { extractPdfText } from '../utils/parser.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

async function runAnalysis(req, resumeText, resumeName) {
  const result = analyzeResume(resumeText, req.body.jobDescription);
  const report = await reportService.createReport(req.user.id, {
    resumeName,
    jobTitle: req.body.jobTitle || 'Target role',
    ...result,
  });
  return report;
}

export const analyzeText = asyncHandler(async (req, res) => {
  if (!req.body.resumeText) throw new ApiError(400, 'Resume text is required');
  const report = await runAnalysis(req, req.body.resumeText, 'Pasted resume');
  res.status(201).json({ data: report });
});

export const analyzePdf = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Choose a PDF resume to upload');
  const resumeText = await extractPdfText(req.file.buffer);
  if (resumeText.trim().length < 100) {
    throw new ApiError(400, 'The PDF contains too little readable text. Try pasting your resume instead.');
  }
  const resumeName = req.file.originalname.split(/[\\/]/).pop().slice(0, 200) || 'Resume.pdf';
  const report = await runAnalysis(req, resumeText, resumeName);
  res.status(201).json({ data: report });
});
