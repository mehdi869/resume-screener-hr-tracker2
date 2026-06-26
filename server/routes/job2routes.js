const express = require('express');
const router = express.Router();
const Job2 = require('../models/Job2');

router.post('/', async (req,res) => {
    try{
        const { title, description } = req.body;
        const newJob = new Job2({ title, description });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', async (req,res) => {
    try{
        const jobs = await Job2.find().sort({ _id: -1 });
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;