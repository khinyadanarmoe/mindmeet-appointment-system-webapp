// Test script for user login API
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/user/login';

async function testUserLogin() {
  console.log('Testing user login API...');

  try {
    // Test case 1: Valid credentials
    console.log('\n--- Test Case 1: Valid credentials ---');
    const validData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const response = await axios.post(API_URL, validData);
      console.log('Status:', response.status);
      console.log('Response:', response.data);
      
      if (response.data.token) {
        console.log('✅ SUCCESS: Login successful and token received');
      } else {
        console.log('❌ FAIL: Login successful but no token received');
      }
    } catch (error) {
      console.log('❌ FAIL: Login with valid credentials failed');
      console.log('Error:', error.response ? error.response.data : error.message);
    }

    // Test case 2: Invalid email
    console.log('\n--- Test Case 2: Invalid email ---');
    const invalidEmailData = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };
    
    try {
      const response = await axios.post(API_URL, invalidEmailData);
      console.log('Status:', response.status);
      console.log('Response:', response.data);
      console.log('❌ FAIL: Should not accept invalid email');
    } catch (error) {
      console.log('Status:', error.response ? error.response.status : 'No status');
      console.log('Response:', error.response ? error.response.data : error.message);
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        console.log('✅ SUCCESS: Properly rejected invalid email');
      } else {
        console.log('❓ INCONCLUSIVE: Rejected but with unexpected error');
      }
    }

    // Test case 3: Invalid password
    console.log('\n--- Test Case 3: Invalid password ---');
    const invalidPasswordData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };
    
    try {
      const response = await axios.post(API_URL, invalidPasswordData);
      console.log('Status:', response.status);
      console.log('Response:', response.data);
      console.log('❌ FAIL: Should not accept invalid password');
    } catch (error) {
      console.log('Status:', error.response ? error.response.status : 'No status');
      console.log('Response:', error.response ? error.response.data : error.message);
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        console.log('✅ SUCCESS: Properly rejected invalid password');
      } else {
        console.log('❓ INCONCLUSIVE: Rejected but with unexpected error');
      }
    }

    // Test case 4: Missing fields
    console.log('\n--- Test Case 4: Missing fields ---');
    const missingFieldsData = {
      email: 'test@example.com'
      // password field is missing
    };
    
    try {
      const response = await axios.post(API_URL, missingFieldsData);
      console.log('Status:', response.status);
      console.log('Response:', response.data);
      console.log('❌ FAIL: Should not accept request with missing fields');
    } catch (error) {
      console.log('Status:', error.response ? error.response.status : 'No status');
      console.log('Response:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400) {
        console.log('✅ SUCCESS: Properly rejected request with missing fields');
      } else {
        console.log('❓ INCONCLUSIVE: Rejected but with unexpected error');
      }
    }

  } catch (error) {
    console.error('Test execution error:', error);
  }
}

// Execute the tests
testUserLogin();