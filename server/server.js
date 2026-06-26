const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
const job2Routes = require('./routes/job2routes');
const application2Routes = require('./routes/application2routes');

// Mount API Routes
app.use('/api/jobs', job2Routes);
app.use('/api/applications', application2Routes);

// Sample Route
app.get('/', (req, res) => {
    res.send('MERN Backend is running!');
});

//database connection
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection established successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});