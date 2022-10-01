const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Signup validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // Implement authentication, storing user in the Database

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        name
      });

      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: 'User created', userId: result._id });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      next(error);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  // Check if user exists in Database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }

      // Validate password
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('User has provided incorrect password.');
        error.statusCode = 401;
        throw error;
      }

      // Generate the JSON Web Token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'credentialkey', // Private key
        { expiresIn: '1h' }
      );

      // Return to client
      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      next(error);
    });
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const getUserResult = await User.findById(req.userId);

    console.log({ 'get-user-status': getUserResult });

    if (!getUserResult) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    // Send response to client
    const responseData = {
      status: getUserResult.status
    };

    res.status(200).json(responseData);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const newStatus = req.body.status;
    const getUserResult = await User.findById(req.userId);

    if (!getUserResult) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    getUserResult.status = newStatus;
    await getUserResult.save();

    // Send response to client
    const responseData = {
      message: 'User updated status.'
    };

    return res.status(200).json(responseData);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
