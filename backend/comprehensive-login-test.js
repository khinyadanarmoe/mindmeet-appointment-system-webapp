// Comprehensive test suite for user login API
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/user/login';

async function testUserLogin() {
  console.log('=== COMPREHENSIVE USER LOGIN API TEST ===\n');

  // Test Case 1: Valid login with known good credentials
  console.log('TEST CASE 1: Valid login');
  try {
    const response = await axios.post(API_URL, {
      email: 'mia@gmail.com',
      password: 'mia@123'
    });
    console.log('✅ SUCCESS: Status code:', response.status);
    console.log('Message:', response.data.message);
    console.log('Token received:', !!response.data.token);
    console.log('Test case 1 passed\n');
  } catch (error) {
    console.log('❌ FAIL: Valid login failed');
    console.log('Error:', error.response ? error.response.data : error.message);
    console.log('Test case 1 failed\n');
  }

  // Test Case 2: Invalid password
  console.log('TEST CASE 2: Invalid password');
  try {
    const response = await axios.post(API_URL, {
      email: 'mia@gmail.com',
      password: 'wrongpassword'
    });
    console.log('❌ FAIL: Should not accept invalid password');
    console.log('Test case 2 failed\n');
  } catch (error) {
    console.log('✅ SUCCESS: Server rejected invalid password as expected');
    console.log('Status code:', error.response ? error.response.status : 'Unknown');
    console.log('Error message:', error.response ? error.response.data.error : error.message);
    console.log('Test case 2 passed\n');
  }

  // Test Case 3: Non-existent user
  console.log('TEST CASE 3: Non-existent user');
  try {
    const response = await axios.post(API_URL, {
      email: 'nonexistent@example.com',
      password: 'password123'
    });
    console.log('❌ FAIL: Should not accept non-existent user');
    console.log('Test case 3 failed\n');
  } catch (error) {
    console.log('✅ SUCCESS: Server rejected non-existent user as expected');
    console.log('Status code:', error.response ? error.response.status : 'Unknown');
    console.log('Error message:', error.response ? error.response.data.error : error.message);
    console.log('Test case 3 passed\n');
  }

  // Test Case 4: Missing email
  console.log('TEST CASE 4: Missing email');
  try {
    const response = await axios.post(API_URL, {
      password: 'password123'
    });
    console.log('❌ FAIL: Should not accept missing email');
    console.log('Test case 4 failed\n');
  } catch (error) {
    console.log('✅ SUCCESS: Server rejected missing email as expected');
    console.log('Status code:', error.response ? error.response.status : 'Unknown');
    console.log('Error message:', error.response ? error.response.data.error : error.message);
    console.log('Test case 4 passed\n');
  }

  // Test Case 5: Missing password
  console.log('TEST CASE 5: Missing password');
  try {
    const response = await axios.post(API_URL, {
      email: 'mia@gmail.com'
    });
    console.log('❌ FAIL: Should not accept missing password');
    console.log('Test case 5 failed\n');
  } catch (error) {
    console.log('✅ SUCCESS: Server rejected missing password as expected');
    console.log('Status code:', error.response ? error.response.status : 'Unknown');
    console.log('Error message:', error.response ? error.response.data.error : error.message);
    console.log('Test case 5 passed\n');
  }

  console.log('=== TEST SUMMARY ===');
  console.log('All tests completed.');
}

// Run the tests
testUserLogin();