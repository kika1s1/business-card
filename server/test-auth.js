// Simple test script to verify authentication
const axios = require('axios').default;

const BASE_URL = 'http://localhost:3001';

async function testAuthentication() {
  console.log('🧪 Testing Authentication with Dummy Data\n');

  try {
    // Test admin login
    console.log('1. Testing Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful!');
    console.log('   User:', adminLogin.data.user.firstName, adminLogin.data.user.lastName);
    console.log('   Role:', adminLogin.data.user.role);
    console.log('   Token:', adminLogin.data.token.substring(0, 20) + '...\n');

    // Test regular user login
    console.log('2. Testing Regular User Login...');
    const userLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'john@test.com',
      password: 'user123'
    });
    
    console.log('✅ User login successful!');
    console.log('   User:', userLogin.data.user.firstName, userLogin.data.user.lastName);
    console.log('   Role:', userLogin.data.user.role);
    console.log('   Token:', userLogin.data.token.substring(0, 20) + '...\n');

    // Test invalid login
    console.log('3. Testing Invalid Login...');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'wrong@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Invalid login correctly rejected!');
      console.log('   Status:', error.response.status);
      console.log('   Message:', error.response.data.message, '\n');
    }

    // Test templates endpoint
    console.log('4. Testing Templates Endpoint...');
    const templates = await axios.get(`${BASE_URL}/api/templates`);
    console.log('✅ Templates loaded successfully!');
    console.log('   Templates count:', templates.data.length);
    console.log('   First template:', templates.data[0].name, '\n');

    // Test admin analytics (with admin token)
    console.log('5. Testing Admin Analytics...');
    const analytics = await axios.get(`${BASE_URL}/api/admin/analytics`, {
      headers: {
        Authorization: `Bearer ${adminLogin.data.token}`
      }
    });
    console.log('✅ Admin analytics loaded successfully!');
    console.log('   Total users:', analytics.data.totalUsers);
    console.log('   Total cards:', analytics.data.totalCards, '\n');

    console.log('🎉 All tests passed! Authentication is working correctly with dummy data.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testAuthentication(); 