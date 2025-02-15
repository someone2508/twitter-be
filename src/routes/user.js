const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.post('/api/v1/follow', middleware.verifyToken, userController.followUser);

module.exports = router;