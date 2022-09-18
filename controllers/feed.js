const fs = require('fs');
const path = require('path');

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

    if (!req.file) {
      const error = new Error('No image provided.');
      error.statusCode = 422;
      throw error;
    }

    const imageUrl = req.file.path;

    // req.body will works cause bodyParser.json()
    console.log('create-post-request: ', req.body);

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
      title,
      content,
      imageUrl: imageUrl,
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

exports.updatePost = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;

    let imageUrl = req.body.image;

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }

    // Update post action in Database
    const updatePost = await Post.findById(postId);

    console.log({ 'update-post-byId': updatePost });

    if (!updatePost) {
      const error = new Error('Cloud not find post.');
      error.statusCode = 404;
      throw error;
    }

    if (imageUrl !== updatePost.imageUrl) {
      clearImage(updatePost.imageUrl);
    }

    updatePost.title = title;
    updatePost.imageUrl = imageUrl;
    updatePost.content = content;
    const updatePostResponse = await updatePost.save();

    console.log({ 'update-post-response': updatePostResponse });

    res
      .status(200)
      .json({ message: 'Post updated successfully', post: updatePostResponse });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    // Extract post id from request parameters
    const postId = req.params.postId;

    // Find the post by id to delete
    const getPostId = await Post.findById(postId);

    console.log({ 'get-post-id': getPostId });

    if (!getPostId) {
      const error = new Error('Cloud not find post.');
      error.statusCode = 404;
      throw error;
    }

    // Check logged in user
    clearImage(getPostId.imageUrl);

    // Delete post in Database
    const deletePostById = await Post.findByIdAndRemove(postId);

    console.log({ 'delete-post-by-id': deletePostById });

    res
      .status(200)
      .json({ message: 'Deleted post successfully', deletePostById });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const clearImage = (filePath) => {
  console.log({ 'clear-image': filePath });
  filePath = path.join(__dirname, '..', filePath);

  // Delete that file by passing a file path
  fs.unlink(filePath, (error) => {
    console.log({ 'delete-image-file-error': error });
  });
};
