const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authValidation } = require('../validation/authValidation');

router.post('/signup', authValidation, authController.signup);
router.post('/login', authController.login);

module.exports = router;