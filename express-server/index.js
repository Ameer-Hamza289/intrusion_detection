const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require("dotenv").config();

// Middleware setup
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'insights.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create insights table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS insights (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                attack_session_id TEXT,
                insights TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Insights table ready');
                // Add attack_session_id column if it doesn't exist (for existing databases)
                db.run(`ALTER TABLE insights ADD COLUMN attack_session_id TEXT`, (err) => {
                    // Ignore error if column already exists
                });
            }
        });
    }
});

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to intrusion detection system!');
});

// Get all insights
app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM insights ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching insights:', err.message);
            return res.status(500).json({ error: 'Failed to fetch insights' });
        }
        res.json({ insights: rows });
    });
});

// Post insights (array of chart URLs)
app.post('/api/data', (req, res) => {
    const { insights, attack_session_id } = req.body;
    console.log('Received insights:', req.body);

    if (!insights || !Array.isArray(insights)) {
        return res.status(400).json({
            error: 'Invalid request. Expected { insights: [], attack_session_id?: string } with array of URLs'
        });
    }

    const sessionId = attack_session_id || `session_${Date.now()}`;
    console.log(`Received ${insights.length} insights/charts for session: ${sessionId}`);

    // Store insights as JSON string
    const insightsJson = JSON.stringify(insights);

    db.run(
        'INSERT INTO insights (attack_session_id, insights) VALUES (?, ?)',
        [sessionId, insightsJson],
        function(err) {
            if (err) {
                console.error('Error inserting insights:', err.message);
                return res.status(500).json({ error: 'Failed to store insights' });
            }

            console.log(`Insights stored with ID: ${this.lastID} for session: ${sessionId}`);
            res.json({
                success: true,
                message: `Successfully stored ${insights.length} insights`,
                id: this.lastID,
                session_id: sessionId,
                count: insights.length
            });
        }
    );
});

// Get insights by session
app.get('/api/data/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    db.all(
        'SELECT * FROM insights WHERE attack_session_id = ? ORDER BY created_at DESC',
        [sessionId],
        (err, rows) => {
            if (err) {
                console.error('Error fetching insights:', err.message);
                return res.status(500).json({ error: 'Failed to fetch insights' });
            }
            res.json({ insights: rows, session_id: sessionId });
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});