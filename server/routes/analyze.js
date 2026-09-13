import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { createCandidate } from '../services/candidateStore.js';
import { getAiExplanation } from '../services/aiAnalyzer.js';
import { findJob } from '../jobs/index.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (request, file, callback) => callback(null, file.mimetype === 'application/pdf')
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const commonSkills = ['javascript', 'react', 'node.js', 'node', 'express', 'sql', 'java', 'python', 'c++', 'html', 'css', 'git', 'docker', 'aws', 'communication', 'excel', 'rest api', 'machine learning'];
const normalize = value => value.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ');

function findImportantKeywords(jobDescription) {
  const text = normalize(jobDescription);
  const foundSkills = commonSkills.filter(skill => text.includes(skill));
  const extraWords = text.match(/\b[a-z][a-z+#.]{3,}\b/g) || [];
  return [...new Set([...foundSkills, ...extraWords.filter(word => !['this', 'that', 'with', 'have', 'will', 'from', 'your', 'work', 'years', 'team'].includes(word))])].slice(0, 25);
}

router.post('/', upload.single('resume'), async (request, response) => {
  try {
    const { name, email, phone = '', jobId } = request.body;
    const job = findJob(jobId);
    if (!name?.trim() || !email?.trim() || !job) return response.status(400).json({ message: 'Name, email, and a valid job are required.' });
    if (!emailPattern.test(email)) return response.status(400).json({ message: 'Please enter a valid email address.' });
    if (!request.file) return response.status(400).json({ message: 'Please upload a PDF resume.' });
    const pdf = await pdfParse(request.file.buffer);
    const resumeText = pdf.text.trim();
    if (!resumeText) return response.status(400).json({ message: 'The PDF does not contain readable text.' });

    const jobDescription = job.description;
    const keywords = findImportantKeywords(jobDescription);
    const resume = normalize(resumeText);
    const matchingSkills = keywords.filter(keyword => resume.includes(keyword));
    const missingSkills = keywords.filter(keyword => !matchingSkills.includes(keyword));
    const matchScore = keywords.length ? Math.round((matchingSkills.length / keywords.length) * 100) : 0;
    const explanation = await getAiExplanation(resumeText, jobDescription, matchingSkills, missingSkills);
    const candidate = createCandidate({ name: name.trim(), email: email.trim(), phone: phone.trim(), resumeFileName: request.file.originalname, resumeText, jobDescription: jobDescription.trim(), matchScore, matchingSkills, missingSkills, ...explanation });
    response.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Analysis could not be completed. Please try again.' });
  }
});

export default router;