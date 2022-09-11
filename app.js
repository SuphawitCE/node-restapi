const bodyParser = require('body-parser');
const express = require('express');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); //  x-www-form-urlencoded Use with form <form>
app.use(bodyParser.json()); //  application/json

app.use('/feed', feedRoutes);

app.listen(8080);
