const { errorHandler } = require('./middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      statusCode: null, // Start with no status code
      status: jest.fn(() => res),
      json: jest.fn(() => res),
    };
    next = jest.fn();
  });

  it('should default to status code 500 if res.statusCode is not set', () => {
    const error = new Error('Something went wrong');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong',
      stack: expect.any(String), // In test env, stack is included
    });
  });
});