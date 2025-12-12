const {
  registerUser,
  loginUser,
} = require('../controllers/userController');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// Mock the dependencies
jest.mock('../models/userModel');
jest.mock('bcryptjs');
jest.mock('../utils/generateToken');
jest.mock('express-validator');


describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: null, // This will be set by the 'protect' middleware in a real scenario
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  //== Test Suite for registerUser ==//
  describe('registerUser', () => {
    beforeEach(() => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
    });

    it('should create a new user and return a token on successful registration', async () => {
      const newUser = {
        _id: 'userId123',
        name: 'Test User',
        email: 'test@example.com',
      };
      const token = 'mock-jwt-token';

      validationResult.mockReturnValue({ isEmpty: () => true });
      User.findOne.mockResolvedValue(null); // No user exists
      User.create.mockResolvedValue(newUser);
      generateToken.mockReturnValue(token);

      await registerUser(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: token,
      });
    });

    it('should return a 400 error if user already exists', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      User.findOne.mockResolvedValue({ _id: 'existingUserId' }); // User exists

      await registerUser(req, res, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('User already exists');
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return a 400 error if validation fails', async () => {
      const errors = {
        isEmpty: () => false,
        array: () => [{ msg: 'Invalid email' }],
      };
      validationResult.mockReturnValue(errors);

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Invalid email');
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return a 400 error for invalid user data if user creation fails', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(null); // Simulate creation failure
      await registerUser(req, res, next);
      expect(next.mock.calls[0][0].message).toBe('Invalid user data');
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  //== Test Suite for loginUser ==//
  describe('loginUser', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
    });

    it('should log in a user and return a token on valid credentials', async () => {
      const existingUser = {
        _id: 'userId123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const token = 'mock-jwt-token';

      validationResult.mockReturnValue({ isEmpty: () => true });
      User.findOne.mockResolvedValue(existingUser);
      bcrypt.compare.mockResolvedValue(true); // Passwords match
      generateToken.mockReturnValue(token);

      await loginUser(req, res, next);
      expect(validationResult).toHaveBeenCalledWith(req);
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, existingUser.password);
      expect(res.json).toHaveBeenCalledWith({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        token: token,
      });
    });

    it('should return a 400 error for invalid credentials (wrong password)', async () => {
      validationResult.mockReturnValue({ isEmpty: () => true });
      const existingUser = { password: 'hashedPassword' };
      User.findOne.mockResolvedValue(existingUser);
      bcrypt.compare.mockResolvedValue(false); // Passwords do not match

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});