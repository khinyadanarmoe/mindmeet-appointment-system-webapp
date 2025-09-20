// Interactive test script for user login API
import axios from 'axios';
import readline from 'readline';

const API_URL = 'http://localhost:4000/api/user/login';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function interactiveTest() {
  console.log('=== MindMeet User Login API Tester ===');
  console.log('This tool will help you test the login functionality');
  console.log('Enter your credentials when prompted\n');

  rl.question('Enter your email: ', async (email) => {
    rl.question('Enter your password: ', async (password) => {
      console.log('\nTesting login with provided credentials...');

      try {
        const response = await axios.post(API_URL, { email, password });
        
        console.log('\n✅ LOGIN SUCCESSFUL');
        console.log('Status code:', response.status);
        console.log('Message:', response.data.message);
        console.log('Token received:', !!response.data.token);
        
        if (response.data.token) {
          console.log('\nAuthentication token:');
          console.log(response.data.token.substring(0, 20) + '...');
          
          console.log('\nYou can now use this token for authenticated requests:');
          console.log('1. Add to Headers: { "Authorization": "Bearer YOUR_TOKEN" }');
          console.log('2. Use it to access protected routes that require authentication');
        }
      } catch (error) {
        console.log('\n❌ LOGIN FAILED');
        console.log('Status code:', error.response ? error.response.status : 'Unknown');
        console.log('Error message:', error.response ? error.response.data.error || error.response.data.message : error.message);
        
        console.log('\nPossible issues:');
        console.log('- Email or password incorrect');
        console.log('- User does not exist');
        console.log('- Server error');
        console.log('- Network issue (check if backend is running)');
      }
      
      rl.close();
    });
  });
}

interactiveTest();