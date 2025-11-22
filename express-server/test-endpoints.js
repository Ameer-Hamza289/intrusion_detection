// Test script for Express server endpoints
const http = require('http');

const BASE_URL = 'http://localhost:4001';

// Test data - simulating chart URLs from notebook
const testInsights = [
    "https://drive.google.com/uc?export=view&id=test_chart_1",
    "https://drive.google.com/uc?export=view&id=test_chart_2",
    "https://drive.google.com/uc?export=view&id=test_chart_3"
];

const testSessionId = `attack_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`;

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error(`Connection error: ${err.message} (Is server running on ${BASE_URL}?)`));
        });

        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout - server may not be running'));
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing Express Server Endpoints\n');
    console.log('=' .repeat(50));

    // Test 1: Root endpoint
    console.log('\n1️⃣  Testing GET / (root endpoint)');
    try {
        const response = await makeRequest('GET', '/');
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${response.data}`);
        if (response.status === 200) {
            console.log('   ✅ Root endpoint working');
        } else {
            console.log('   ❌ Root endpoint failed');
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 2: POST /data with insights
    console.log('\n2️⃣  Testing POST /data (send insights)');
    try {
        const payload = {
            insights: testInsights,
            attack_session_id: testSessionId
        };
        const response = await makeRequest('POST', '/data', payload);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        if (response.status === 200 && response.data.success) {
            console.log('   ✅ POST /data working');
            const storedId = response.data.id;
            const storedSessionId = response.data.session_id;
            console.log(`   📝 Stored with ID: ${storedId}, Session: ${storedSessionId}`);
        } else {
            console.log('   ❌ POST /data failed');
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 3: GET /data (all insights)
    console.log('\n3️⃣  Testing GET /data (get all insights)');
    try {
        const response = await makeRequest('GET', '/data');
        console.log(`   Status: ${response.status}`);
        if (response.status === 200 && response.data.insights) {
            console.log(`   ✅ GET /data working`);
            console.log(`   📊 Total insights stored: ${response.data.insights.length}`);
            if (response.data.insights.length > 0) {
                console.log(`   📋 Latest insight:`);
                const latest = response.data.insights[0];
                const insights = JSON.parse(latest.insights);
                console.log(`      - Session ID: ${latest.attack_session_id}`);
                console.log(`      - Charts count: ${insights.length}`);
                console.log(`      - Created at: ${latest.created_at}`);
            }
        } else {
            console.log('   ❌ GET /data failed');
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 4: GET /data/session/:sessionId
    console.log(`\n4️⃣  Testing GET /data/session/${testSessionId}`);
    try {
        const response = await makeRequest('GET', `/data/session/${testSessionId}`);
        console.log(`   Status: ${response.status}`);
        if (response.status === 200 && response.data.insights) {
            console.log(`   ✅ GET /data/session/:sessionId working`);
            console.log(`   📊 Insights for session: ${response.data.insights.length}`);
        } else {
            console.log('   ❌ GET /data/session/:sessionId failed');
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 5: POST /data with invalid data
    console.log('\n5️⃣  Testing POST /data with invalid data (should fail)');
    try {
        const response = await makeRequest('POST', '/data', { invalid: 'data' });
        console.log(`   Status: ${response.status}`);
        if (response.status === 400) {
            console.log('   ✅ Validation working correctly');
        } else {
            console.log('   ⚠️  Expected 400 error but got:', response.status);
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Testing complete!');
    console.log('\n💡 To test from notebook, use:');
    console.log(`   BASE_URL = "http://localhost:3000"`);
    console.log(`   payload = { "insights": [${testInsights.map(u => `"${u}"`).join(', ')}], "attack_session_id": "${testSessionId}" }`);
}

// Wait a bit for server to start, then run tests
setTimeout(() => {
    runTests().catch(console.error);
}, 2000);
