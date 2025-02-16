const express = require('express');
const router = express.Router();

const tweetController = require('../controllers/tweetControllers');
const middleware = require('../../middleware/authMiddleware');

router.post('/api/v1/tweet', middleware.verifyToken, tweetController.createTweet);
router.delete('/api/v1/tweet', middleware.verifyToken, tweetController.deleteTweet);
router.get('/api/v1/tweet', middleware.verifyToken, tweetController.getTweet);
router.post('/api/v1/tweet/like', middleware.verifyToken, tweetController.likeTweet);
router.delete('/api/v1/tweet/like', middleware.verifyToken, tweetController.unlikeTweet);

module.exports = router;