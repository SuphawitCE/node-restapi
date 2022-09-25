const express = require('express');

const router = express.Router();

// Endpoint can be use both PUT and POST
router.put('/signup');

module.exports = router;
