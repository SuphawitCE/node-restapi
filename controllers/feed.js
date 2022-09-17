const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  // req.body will works cause bodyParser.json()
  console.log('get-post-request: ', req.body);

  // Fetch data from Database
  Post.find()
    .then((posts) => {
      console.log('get-post-response: ', posts);
      res.status(200).json({ message: 'Fetch posts successfully.', posts });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      next(error);
    });
};

// POST method
exports.createPost = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    // req.body will works cause bodyParser.json()
    console.log('create-post-request: ', req.body);

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
      title,
      content,
      imageUrl: 'images/fatcat1.jpeg',
      creator: { name: 'Bank' }
    });

    // Storing posts in the MongoDB
    const postResult = await post.save();

    const responseData = {
      message: 'Post created successfully',
      post: postResult
    };

    console.log('post-result: ', postResult);

    // Response created post successfully to client-side
    res.status(201).json(responseData);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Cloud not find post.');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: 'Post fetched. ', post });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      next(error);
    });
};
