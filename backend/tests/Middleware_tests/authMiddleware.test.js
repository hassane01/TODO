const jwt = require('jsonwebtoken');
const { protect } = require('../../middleware/authMiddleware');
const User = require('../../models/userModel');

jest.mock('jsonwebtoken');
jest.mock('../../models/userModel');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn(() => res),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  it('should call next() and set req.user if token is valid', async () => {
    const token = 'valid-token';
    const decoded = { id: 'userId123' };
    const user = { _id: 'userId123', name: 'Test User', email: 'test@example.com' };

    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockReturnValue(decoded);
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    expect(User.findById).toHaveBeenCalledWith(decoded.id);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next with an error if no token is provided', async () => {
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Not authorized, no token');
  });

  it('should call next with an error if authorization header does not start with "Bearer"', async () => {
    req.headers.authorization = 'Token invalid-token';

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Not authorized, no token');
  });

  it('should call next with an error if token verification fails', async () => {
    const token = 'invalid-token';
    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockImplementation(() => {
      throw new Error('Verification failed');
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Not authorized, token failed');
  });

  it('should call next with an error if user is not found', async () => {
    const token = 'valid-token-no-user';
    const decoded = { id: 'nonExistentUserId' };

    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockReturnValue(decoded);
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Not authorized, user not found');
  });
});