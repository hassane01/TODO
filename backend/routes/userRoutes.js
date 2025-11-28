const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe); // This will be protected later

module.exports = router;
