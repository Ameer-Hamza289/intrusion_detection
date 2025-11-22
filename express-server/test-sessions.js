// Test multiple sessions to verify session tracking
const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function testMultipleSessions() {
    console.log('🧪 Testing Multiple Attack Sessions\n');
    console.log('='.repeat(50));

    // Create 3 different sessions
    const sessions = [
        { id: 'attack_session_001', charts: ['chart1.png', 'chart2.png'] },
        { id: 'attack_session_002', charts: ['chart3.png', 'chart4.png', 'chart5.png'] },
        { id: 'attack_session_003', charts: ['chart6.png'] }
    ];

    // Send insights for each session
    for (const session of sessions) {
        console.log(`\n📤 Sending insights for ${session.id}...`);
        const response = await makeRequest('POST', '/data', {
            insights: session.charts,
            attack_session_id: session.id
        });

        if (response.status === 200) {
            console.log(`   ✅ Stored ${response.data.count} charts`);
            console.log(`   📝 Session ID: ${response.data.session_id}`);
        } else {
            console.log(`   ❌ Failed: ${response.data}`);
        }
    }

    // Verify all sessions
    console.log('\n📊 Verifying all sessions...');
    const allResponse = await makeRequest('GET', '/data');
    console.log(`   Total insights in database: ${allResponse.data.insights.length}`);

    // Check each session individually
    for (const session of sessions) {
        const sessionResponse = await makeRequest('GET', `/data/session/${session.id}`);
        const count = sessionResponse.data.insights.length;
        const expected = 1; // Each POST creates one insight record
        console.log(`   ${session.id}: ${count} record(s) (expected: ${expected})`);

        if (count > 0) {
            const charts = JSON.parse(sessionResponse.data.insights[0].insights);
            console.log(`      Charts: ${charts.length} - ${charts.join(', ')}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Session tracking test complete!');
}

testMultipleSessions().catch(console.error);


