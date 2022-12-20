const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const User = require('../../models/user');
const AuthController = require('../../controllers/auth');

const next = () => {};

describe('Authentication Controller - Login', () => {
  it('Should throw an error with status code 500 if database connection failure', (done) => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'qa@test.com',
        password: 'qatest123*'
      }
    };

    AuthController.login(req, {}, next).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });
});
