const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

// Create test user for testing (only run once)
const createTestUser = async () => {
  try {
    console.log('Creating test user...');
    const response = await axios.post(`${API_URL}/user/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Test user creation response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400 && 
        error.response.data.error === 'Email already registered') {
      console.log('Test user already exists, skipping creation');
      return { message: 'User already exists' };
    }
    
    console.error('Error creating test user:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test login with valid credentials
const testValidLogin = async () => {
  try {
    console.log('Testing login with valid credentials...');
    const response = await axios.post(`${API_URL}/user/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Valid login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error testing valid login:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test login with invalid credentials
const testInvalidLogin = async () => {
  try {
    console.log('Testing login with invalid credentials...');
    const response = await axios.post(`${API_URL}/user/login`, {
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    
    console.log('Invalid login response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Expected error with invalid login:', error.response.data);
    return error.response.data;
  }
};

// Run all tests
const runTests = async () => {
  console.log('=== Starting Login API Tests ===');
  
  // Create test user if needed
  await createTestUser();
  
  // Test valid login
  const validResult = await testValidLogin();
  if (validResult && validResult.success && validResult.token) {
    console.log('✅ Valid login test passed');
    
    // Test getting user info with the token
    if (validResult.token) {
      try {
        const userResponse = await axios.get(`${API_URL}/user/get-user-info`, {
          headers: { token: validResult.token }
        });
        console.log('✅ Get user info test passed:', userResponse.data);
      } catch (error) {
        console.log('❌ Get user info test failed:', error.response ? error.response.data : error.message);
      }
    }
  } else {
    console.log('❌ Valid login test failed');
  }
  
  // Test invalid login
  const invalidResult = await testInvalidLogin();
  if (invalidResult && invalidResult.error) {
    console.log('✅ Invalid login test passed (correctly rejected)');
  } else {
    console.log('❌ Invalid login test failed (should have been rejected)');
  }
  
  console.log('=== Login API Tests Completed ===');
};

// Execute tests
runTests().catch(error => {
  console.error('Test execution error:', error);
});