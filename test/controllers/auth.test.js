const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../../models/user');
const AuthController = require('../../controllers/auth');

const next = () => {};

describe('Authentication Controller - Login', () => {
  it('Should throw an error with status code 500 if database connection failure', async () => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'qa@test.com',
        password: 'qatest123*'
      }
    };

    const result = await AuthController.login(req, {}, next);

    // expect(result).to.be.an('error');
    // expect(result).to.have.property('statusCode', 500);

    AuthController.login(req, {}, next).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });

  it('Should send a response with a valid user status for an existing user', (done) => {
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;

    const collectionName = 'test-messages'; //  MongoDB collection name
    const dbURI = `mongodb+srv://${username}:${password}@cluster0.ypnh4.mongodb.net/${collectionName}`; // MongoDB connection URI

    mongoose
      .connect(dbURI)
      .then((result) => {
        const payload = {
          email: 'qa@test.com',
          password: 'qatest123*',
          name: 'QA',
          posts: [],
          _id: 'mock'
        };
        const user = new User(payload);
        return user.save();
      })
      .then(() => {
        const req = { userId: payload._id };
        const res = {
          statusCode: 500,
          userStatus: null,
          json: function (data) {
            this.userStatus = data.status;
            return null;
          },
          status: function (code) {
            this.statusCode = code;
            return this;
          }
        };
        AuthController.getUserStatus(req, res, next).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(req.userStatus).to.be.equal('New user');
          done();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
