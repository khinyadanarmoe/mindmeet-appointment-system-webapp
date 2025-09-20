// debug-login-api.js
// Run this with Node.js to test the login API

const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('Testing login API...');
    
    const backendUrl = 'http://localhost:4000/api';
    const loginUrl = `${backendUrl}/user/login`;
    
    console.log(`Using URL: ${loginUrl}`);
    
    const credentials = {
      email: 'testuser@example.com',
      password: 'password123'
    };
    
    console.log('Sending request with credentials:', { 
      email: credentials.email, 
      password: '[REDACTED]' 
    });
    
    const response = await axios.post(loginUrl, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', {
      'content-type': response.headers['content-type'],
    });
    
    const data = response.data;
    console.log('Response data:', data);
    
    if (response.ok && data.success && data.token) {
      console.log('✅ Login successful! Token received.');
    } else {
      console.log('❌ Login failed:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error during API test:', error);
  }
}

testLoginAPI();