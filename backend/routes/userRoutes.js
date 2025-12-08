const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { body } = require('express-validator');

router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }),
  ],
  registerUser
);

router.post(
  '/login',
  [body('email', 'Please include a valid email').isEmail(), body('password', 'Password is required').exists()],
  loginUser
);

module.exports = router;
