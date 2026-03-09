require('dotenv').config();
const mongoose = require('mongoose');

// Use an in-memory database for testing
beforeAll(async () => {
  // You can configure MongoDB Memory Server here if needed
  // For now, we'll use a test database
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/recouvra-test';
  
  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.warn('Could not connect to MongoDB for testing:', error.message);
  }
});

afterAll(async () => {
  // Clean up after tests
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

// Global test timeout
jest.setTimeout(30000);
