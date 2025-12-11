const jwt = require('jsonwebtoken');
const generateToken = require('../../utils/generateToken');
const mongoose = require('mongoose');

describe('Utility Functions', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT for a given user ID', () => {
      // Create a realistic-looking MongoDB ObjectId
      const userId = new mongoose.Types.ObjectId().toHexString();

      const token = generateToken(userId);

      // Verify the token is valid and contains the correct payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.id).toBe(userId);
      // Check that the token has an expiration (iat and exp are added by jwt.sign)
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });
  });
});