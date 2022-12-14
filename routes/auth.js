const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Endpoint can be use both PUT and POST
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });

        if (userDoc) {
          return Promise.reject('E-mail address already exists');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty()
  ],
  authController.signup
);

// POST /login
router.post('/login', authController.login);

// GET /status
router.get('/status', isAuth, authController.getUserStatus);

// PATCH OR PUT /status
router.put(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  authController.updateUserStatus
);
module.exports = router;
