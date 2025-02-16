const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.delete('/api/v1/user', middleware.verifyToken, userController.deleteMe);
router.post('/api/v1/follow', middleware.verifyToken, userController.followUser);
router.post('/api/v1/unfollow', middleware.verifyToken, userController.unfollowUser);

module.exports = router;