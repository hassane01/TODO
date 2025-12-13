const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Adjust this path to where your Express app is exported
const User = require('../../models/userModel');
const Todo = require('../../models/todoModel');




describe('User API - /api/users', () => {
  // Connect to a test database before any tests run
  beforeAll(async () => {
    // It's crucial to use a different database for testing
    const testMongoUri = process.env.MONGO_URI_TEST;
    if (!testMongoUri) {
      throw new Error('MONGO_URI_TEST is not defined in your .env file');
    }
    await mongoose.connect(testMongoUri);
  });

  // Clear the User collection before each test
  beforeEach(async () => {
    // It's safer to clean all relevant collections to ensure test isolation
    await User.deleteMany({}); 
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      // Check that the response contains the user data and a token
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toBe(newUser.name);
      expect(res.body.email).toBe(newUser.email);
    });

    it('should return 400 if user already exists', async () => {
      // First, create a user
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      });

      // Then, try to register with the same email
      await request(app)
        .post('/api/users')
        .send({ name: 'Another User', email: 'existing@example.com', password: 'password456' })
        .expect(400);
    });

    it('should return 400 if password is less than 6 characters', async () => {
      const newUser = {
        name: 'Test User',
        email: 'shortpass@example.com',
        password: '123', // Invalid password
      };

      const res = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);

      // Check for a meaningful error message
      expect(res.body.message).toContain('Password must be 6 or more characters');
    });

    it('should return 400 if name is missing', async () => {
      const newUser = {
        email: 'noname@example.com',
        password: 'password123',
      };
      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
    });
  });

  describe('POST /login', () => {
    const userCredentials = {
      email: 'login@example.com',
      password: 'password123',
    };

    // Create a user to be used for login tests
    beforeEach(async () => {
      // Clean collections before creating the test user for this suite
      await User.deleteMany({});
      await Todo.deleteMany({});

      await User.create({
        name: 'Login User',
        email: userCredentials.email,
        password: userCredentials.password,
      });
    });

    it('should authenticate a user and return a token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send(userCredentials)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(userCredentials.email);
    });

    it('should return 400 for an incorrect password', async () => {
      await request(app)
        .post('/api/users/login')
        .send({ ...userCredentials, password: 'wrongpassword' })
        .expect(400);
    });

    it('should return 400 for a non-existent user', async () => {
      await request(app)
        .post('/api/users/login')
        .send({ email: 'nouser@example.com', password: 'password123' })
        .expect(400);
    });

    it('should return 400 for invalid input (e.g., invalid email)', async () => {
      await request(app)
        .post('/api/users/login')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(400);
    });
  });
});