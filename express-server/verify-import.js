// Quick script to verify imported insights
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ids_insights';

const insightSchema = new mongoose.Schema({
    attack_session_id: String,
    insights: [String],
    created_at: Date
});

const Insight = mongoose.model('Insight', insightSchema);

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const allInsights = await Insight.find().sort({ created_at: -1 });

        console.log(`📊 Total insights in database: ${allInsights.length}\n`);

        for (const insight of allInsights) {
            console.log(`Session: ${insight.attack_session_id}`);
            console.log(`  Charts: ${insight.insights.length}`);
            console.log(`  Created: ${insight.created_at}`);
            console.log(`  ID: ${insight._id}`);
            console.log(`  Sample URLs (first 3):`);
            insight.insights.slice(0, 3).forEach((url, i) => {
                console.log(`    ${i + 1}. ${url.substring(0, 80)}...`);
            });
            console.log('');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

verify();
