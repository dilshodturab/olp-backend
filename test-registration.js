// Simple test script for user registration
const testUserRegistration = async () => {
  const testUser = {
    full_name: "John Doe",
    email: "john.doe@example.com",
    password: "securepassword123"
  };

  try {
    const response = await fetch('http://localhost:5000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (response.status === 201) {
      console.log('✅ User registration test PASSED');
    } else {
      console.log('❌ User registration test FAILED');
    }
  } catch (error) {
    console.error('Error testing registration:', error);
    console.log('❌ User registration test FAILED');
  }
};

testUserRegistration();
