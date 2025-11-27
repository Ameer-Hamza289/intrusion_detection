// Script to import insights from insights.txt file into MongoDB
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ids_insights';

// MongoDB Schema (same as in index.js)
const insightSchema = new mongoose.Schema({
    attack_session_id: {
        type: String,
        required: true,
        index: true
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

const Insight = mongoose.model('Insight', insightSchema);

// Function to parse Python-style list from file
function parseInsightsFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8').trim();

        // Replace Python True/False with JavaScript true/false
        const jsContent = content
            .replace(/'/g, '"')  // Replace single quotes with double quotes
            .replace(/True/g, 'true')
            .replace(/False/g, 'false');

        // Parse as JSON
        const insightsArray = JSON.parse(jsContent);
        return insightsArray;
    } catch (err) {
        console.error('Error parsing insights file:', err.message);
        throw err;
    }
}

// Main function
async function importInsights() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Read and parse insights file
        const insightsFilePath = path.join(__dirname, '..', 'insights.txt');
        console.log(`📖 Reading insights from: ${insightsFilePath}`);

        const insightsData = parseInsightsFile(insightsFilePath);
        console.log(`📊 Found ${insightsData.length} insights in file`);

        // Group insights by session_id
        const sessionsMap = new Map();

        for (const insight of insightsData) {
            const sessionId = insight.session_id || 'attack_20251125_133000';

            if (!sessionsMap.has(sessionId)) {
                sessionsMap.set(sessionId, []);
            }

            // Extract URL
            if (insight.url) {
                sessionsMap.get(sessionId).push(insight.url);
            }
        }

        console.log(`\n📋 Found ${sessionsMap.size} unique session(s):`);
        for (const [sessionId, urls] of sessionsMap.entries()) {
            console.log(`   - ${sessionId}: ${urls.length} charts`);
        }

        // Insert into MongoDB
        let totalInserted = 0;
        for (const [sessionId, urls] of sessionsMap.entries()) {
            // Check if this session already exists
            const existing = await Insight.findOne({ attack_session_id: sessionId });

            if (existing) {
                console.log(`\n⚠️  Session ${sessionId} already exists in database`);
                console.log(`   Existing charts: ${existing.insights.length}`);
                console.log(`   New charts: ${urls.length}`);

                // Ask if we should update (for now, we'll create a new entry with timestamp)
                const newInsight = new Insight({
                    attack_session_id: sessionId,
                    insights: urls,
                    created_at: new Date()
                });

                await newInsight.save();
                totalInserted++;
                console.log(`   ✅ Created new entry for session ${sessionId}`);
            } else {
                const newInsight = new Insight({
                    attack_session_id: sessionId,
                    insights: urls,
                    created_at: new Date()
                });

                await newInsight.save();
                totalInserted++;
                console.log(`\n✅ Inserted session ${sessionId} with ${urls.length} charts`);
            }
        }

        console.log(`\n🎉 Import complete!`);
        console.log(`   Total sessions inserted: ${totalInserted}`);
        console.log(`   Total charts: ${insightsData.length}`);

        // Verify insertion
        const totalInDb = await Insight.countDocuments();
        console.log(`\n📊 Total insights in database: ${totalInDb}`);

    } catch (err) {
        console.error('❌ Error importing insights:', err.message);
        console.error(err);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
        process.exit(0);
    }
}

// Run the import
importInsights();
