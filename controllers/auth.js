const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

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
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      next(error);
    });
};
