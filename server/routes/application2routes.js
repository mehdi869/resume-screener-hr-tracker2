const express = require('express');
const router = express.Router();
const Job2 = require('../models/Job2');
const Application2 = require('../models/Application2');
const { analyzeResume } = require('../services/aiService');
require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const { job2Id, candidateName, email ,resumeRawText } = req.body;

        const job = await Job2.findById(job2Id);
        if (!job) {
            return res.status(404).json({ message: 'Target job position not found' });
        }

        const textToAnalyze = resumeRawText

        const aiAnalysis = await analyzeResume(textToAnalyze , job.title , job.description);

        const newApplication = new Application2({
            job2Id,
            candidateName,
            email,
            aiSummary: Array.isArray(aiAnalysis.aiSummary) 
                ? aiAnalysis.aiSummary.join(' ') 
                : aiAnalysis.aiSummary,
            aiScore: aiAnalysis.aiScore
        });

        await newApplication.save();
        res.status(201).json(newApplication);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/job/:job2Id', async (req, res) => {
  try {
    const applications = await Application2.find({ job2Id: req.params.job2Id });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

