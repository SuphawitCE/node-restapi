const { expect } = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
require('dotenv').config();

const User = require('../../models/user');
const FeedController = require('../../controllers/feed');
const io = require('../../utils/socket');

const { mockEnv } = require('../fixtures/general.json');
const { mockUserSignUpPayload } = require('../fixtures/requestPayload.json');

const next = () => {};

const username = process.env.MONGO_USERNAME || mockEnv.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD || mockEnv.MONGO_PASSWORD;

const collectionName = 'test-messages'; //  MongoDB collection name
const dbURI = `mongodb+srv://${username}:${password}@cluster0.ypnh4.mongodb.net/${collectionName}`; // MongoDB connection URI

describe('Feed Controller', () => {
  // Create user account before run all tests
  before(async () => {
    await mongoose.connect(dbURI);
    const user = new User(mockUserSignUpPayload);
    await user.save();
    io.init();
  });

  // Delete user account after run all tests
  after(async () => {
    await User.findByIdAndDelete(mockUserSignUpPayload._id);
    await mongoose.disconnect();
  });

  it('Should add a created post to the posts of the creator', async () => {
    const req = {
      body: {
        title: 'mock_title',
        content: 'mock_content'
      },
      file: {
        path: 'mock_path'
      },
      userId: mockUserSignUpPayload._id
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {}
    };

    const result = await FeedController.createPost(req, res, next);

    expect(result).to.have.property('posts');
    expect(result.posts).to.have.length(1);
  });
});
