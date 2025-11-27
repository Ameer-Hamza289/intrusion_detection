const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
require("dotenv").config();

// Middleware setup
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ids_insights';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('mongodb connected successfully');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Make sure MongoDB is running or set MONGODB_URI in .env file');
});

// MongoDB Schema
const insightSchema = new mongoose.Schema({
    attack_session_id: {
        type: String,
        required: true,
        index: true // Add index for faster queries
    },
    insights: {
        type: [String], // Array of chart URLs
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Create model
const Insight = mongoose.model('Insight', insightSchema);

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to intrusion detection system!');
});

app.get("/api/drive-img/:id", async (req, res) => {
    const fileId = req.params.id;

    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer", // important for binary files
      });

      // Set the correct headers
      res.set("Content-Type", response.headers["content-type"]);
      res.set("Cache-Control", "public, max-age=31536000"); // Optional caching

      res.send(response.data);
    } catch (err) {
      console.error("Google Drive proxy error:", err.message);
      return res.status(500).send("Failed to load Google Drive image");
    }
  });

// Get all insights
app.get('/api/data', async (req, res) => {
    try {
        const insights = await Insight.find()
            .sort({ created_at: -1 })
            .lean();

        res.json({ insights });
    } catch (err) {
        console.error('Error fetching insights:', err.message);
        return res.status(500).json({ error: 'Failed to fetch insights' });
    }
});

// Post insights (array of chart URLs)
app.post('/api/data', async (req, res) => {
    const { insights, attack_session_id } = req.body;
    console.log('Received insights:', req.body);

    if (!insights || !Array.isArray(insights)) {
        return res.status(400).json({
            error: 'Invalid request. Expected { insights: [], attack_session_id?: string } with array of URLs'
        });
    }

    const sessionId = attack_session_id || `session_${Date.now()}`;
    console.log(`Received ${insights.length} insights/charts for session: ${sessionId}`);

    try {
        // Create new insight document
        const newInsight = new Insight({
            attack_session_id: sessionId,
            insights: insights, // MongoDB stores arrays directly
            created_at: new Date()
        });

        const savedInsight = await newInsight.save();

        console.log(`Insights stored with ID: ${savedInsight._id} for session: ${sessionId}`);
        res.json({
            success: true,
            message: `Successfully stored ${insights.length} insights`,
            id: savedInsight._id,
            session_id: sessionId,
            count: insights.length
        });
    } catch (err) {
        console.error('Error inserting insights:', err.message);
        return res.status(500).json({ error: 'Failed to store insights' });
    }
});

// Get insights by session
app.get('/api/data/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const insights = await Insight.find({ attack_session_id: sessionId })
            .sort({ created_at: -1 })
            .lean();

        res.json({ insights, session_id: sessionId });
    } catch (err) {
        console.error('Error fetching insights:', err.message);
        return res.status(500).json({ error: 'Failed to fetch insights' });
    }
});

// Backward compatibility: /data endpoints (for notebook)
app.get('/data', async (req, res) => {
    try {
        const insights = await Insight.find()
            .sort({ created_at: -1 })
            .lean();

        res.json({ insights });
    } catch (err) {
        console.error('Error fetching insights:', err.message);
        return res.status(500).json({ error: 'Failed to fetch insights' });
    }
});

app.post('/data', async (req, res) => {
    const { insights, attack_session_id } = req.body;
    console.log('Received insights:', req.body);

    if (!insights || !Array.isArray(insights)) {
        return res.status(400).json({
            error: 'Invalid request. Expected { insights: [], attack_session_id?: string } with array of URLs'
        });
    }

    const sessionId = attack_session_id || `session_${Date.now()}`;
    console.log(`Received ${insights.length} insights/charts for session: ${sessionId}`);

    try {
        const newInsight = new Insight({
            attack_session_id: sessionId,
            insights: insights,
            created_at: new Date()
        });

        const savedInsight = await newInsight.save();

        console.log(`Insights stored with ID: ${savedInsight._id} for session: ${sessionId}`);
        res.json({
            success: true,
            message: `Successfully stored ${insights.length} insights`,
            id: savedInsight._id,
            session_id: sessionId,
            count: insights.length
        });
    } catch (err) {
        console.error('Error inserting insights:', err.message);
        return res.status(500).json({ error: 'Failed to store insights' });
    }
});

app.get('/data/session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const insights = await Insight.find({ attack_session_id: sessionId })
            .sort({ created_at: -1 })
            .lean();

        res.json({ insights, session_id: sessionId });
    } catch (err) {
        console.error('Error fetching insights:', err.message);
        return res.status(500).json({ error: 'Failed to fetch insights' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error closing database:', err.message);
        process.exit(1);
    }
});