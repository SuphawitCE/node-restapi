exports.getPosts = (req, res, next) => {
  // req.body will works cause bodyParser.json()
  console.log('get-post-request: ', req.body);

  const responseData = {
    posts: [
      {
        title: 'First Post',
        content: 'This is first post'
      }
    ]
  };

  console.log('get-post-response: ', responseData);
  res.status(200).json(responseData);
};

// POST method
exports.createPost = (req, res, next) => {
  // req.body will works cause bodyParser.json()
  console.log('create-post-request: ', req.body);

  const title = req.body.title;
  const content = req.body.content;

  // Create post in DB
  const responseData = {
    message: 'Post created successfully',
    post: { id: new Date().toISOString(), title, content }
  };

  console.log('create-post-response: ', responseData);

  res.status(201).json(responseData);
};
