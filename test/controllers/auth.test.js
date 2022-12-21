const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../../models/user');
const AuthController = require('../../controllers/auth');

const { mockUserSignUpPayload } = require('../fixtures/requestPayload.json');

const next = () => {};

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const collectionName = 'test-messages'; //  MongoDB collection name
const dbURI = `mongodb+srv://${username}:${password}@cluster0.ypnh4.mongodb.net/${collectionName}`; // MongoDB connection URI

describe('Authentication Controller', () => {
  // Create user account before run all tests
  before(async () => {
    await mongoose.connect(dbURI);
    const user = new User(mockUserSignUpPayload);
    await user.save();
  });

  // Delete user account after run all tests
  after(async () => {
    await User.findByIdAndDelete(mockUserSignUpPayload._id);
    await mongoose.disconnect();
  });

  it('Should throw an error with status code 500 if database connection failure', async () => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: mockUserSignUpPayload.email,
        password: mockUserSignUpPayload.password
      }
    };

    const result = await AuthController.login(req, {}, next);

    expect(result).to.be.an('error');
    expect(result).to.have.property('statusCode', 500);

    User.findOne.restore();
  });

  it('Should send a response with a valid user status for an existing user', async () => {
    const req = { userId: mockUserSignUpPayload._id };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      }
    };

    await AuthController.getUserStatus(req, res, next);
    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal('New user');
  });
});
