const bodyParser = require('body-parser');
const express = require('express');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); //  x-www-form-urlencoded Use with form <form>
app.use(bodyParser.json()); //  application/json

// CORS
app.use((req, res, next) => {
  //  Allow origin and can access all clients using wildcard
  res.setHeader('Access-Control-Allow-Origin', '*');

  //  Allow request method or can use a wildcard to allow all methods
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  //  Allow authorization
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Request can now continue and can be handled by our routes
  next();
});

app.use('/feed', feedRoutes);

app.listen(8080);
