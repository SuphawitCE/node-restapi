const { validationResult } = require('express-validator/check');

exports.getPosts = (req, res, next) => {
  // req.body will works cause bodyParser.json()
  console.log('get-post-request: ', req.body);

  const responseData = {
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is first post',
        imageUrl: 'images/fatcat1.jpeg',
        creator: {
          name: 'Bank'
        },
        createdAt: new Date()
      }
    ]
  };

  console.log('get-post-response: ', responseData);
  res.status(200).json(responseData);
};

// POST method
exports.createPost = (req, res, next) => {
  // Validate request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    });
  }

  // req.body will works cause bodyParser.json()
  console.log('create-post-request: ', req.body);

  const title = req.body.title;
  const content = req.body.content;

  // Create post in DB
  const responseData = {
    message: 'Post created successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'Bank' },
      createdAt: new Date()
    }
  };

  console.log('create-post-response: ', responseData);

  res.status(201).json(responseData);
};
