const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Helper function để gọi API
async function callAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error(`Error calling ${endpoint}:`, error.message);
        return { status: 500, data: { error: error.message } };
    }
}

// Test functions
async function testHealthCheck() {
    console.log('\n🔍 Testing Health Check...');
    const result = await callAPI('/health');
    console.log('Health Check Result:', result);
}

async function testKeyGeneration() {
    console.log('\n🔑 Testing Key Generation...');
    const result = await callAPI('/api/keys/generate', 'POST', { keySize: 2048 });
    console.log('Key Generation Result:', result);
    return result.data;
}

async function testKeyStatus() {
    console.log('\n📊 Testing Key Status...');
    const result = await callAPI('/api/keys/status');
    console.log('Key Status Result:', result);
}

async function testGetPublicKey() {
    console.log('\n🔓 Testing Get Public Key...');
    const result = await callAPI('/api/keys/public');
    console.log('Public Key Result:', result);
}

async function testCreateJWT() {
    console.log('\n🎫 Testing JWT Creation...');
    const payload = {
        user_id: 123,
        role: 'admin',
        username: 'Tkon',
        email: 'tkon@example.com'
    };
    
    const options = {
        expiresIn: '1h',
        issuer: 'jwt-rsa256-api',
    };

    const result = await callAPI('/api/jwt/create', 'POST', { payload, options });
    console.log('JWT Creation Result:', result);
    return result.data;
}

async function testVerifyJWT(token) {
    console.log('\n✅ Testing JWT Verification...');
    const result = await callAPI('/api/jwt/verify', 'POST', { token });
    console.log('JWT Verification Result:', result);
}

async function testDecodeJWT(token) {
    console.log('\n🔍 Testing JWT Decode...');
    const result = await callAPI('/api/jwt/decode', 'POST', { token });
    console.log('JWT Decode Result:', result);
}

async function testCheckExpiration(token) {
    console.log('\n⏰ Testing JWT Expiration Check...');
    const result = await callAPI('/api/jwt/check-expiration', 'POST', { token });
    console.log('JWT Expiration Check Result:', result);
}

async function testInvalidToken() {
    console.log('\n❌ Testing Invalid Token...');
    const result = await callAPI('/api/jwt/verify', 'POST', { 
        token: 'invalid.token.here' 
    });
    console.log('Invalid Token Result:', result);
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting API Tests...\n');
    
    try {
        // Test health check
        await testHealthCheck();
        
        // Test key generation
        const keyResult = await testKeyGeneration();
        
        // Test key status
        await testKeyStatus();
        
        // Test get public key
        await testGetPublicKey();
        
        // Test JWT creation
        const jwtResult = await testCreateJWT();
        
        if (jwtResult && jwtResult.token) {
            // Test JWT verification
            await testVerifyJWT(jwtResult.token);
            
            // Test JWT decode
            await testDecodeJWT(jwtResult.token);
            
            // Test expiration check
            await testCheckExpiration(jwtResult.token);
        }
        
        // Test invalid token
        await testInvalidToken();
        
        console.log('\n✅ All tests completed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    callAPI,
    testHealthCheck,
    testKeyGeneration,
    testKeyStatus,
    testGetPublicKey,
    testCreateJWT,
    testVerifyJWT,
    testDecodeJWT,
    testCheckExpiration,
    testInvalidToken,
    runAllTests
}; 