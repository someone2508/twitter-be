const express = require('express');
const router = express.Router();

const tweetController = require('../controllers/tweetControllers');
const middleware = require('../../middleware/authMiddleware');

router.post('/api/v1/tweet', middleware.verifyToken, tweetController.createTweet);

module.exports = router;