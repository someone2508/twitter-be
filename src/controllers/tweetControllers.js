const User = require('../models/User');
const Tweet = require('../models/Tweet');

const createTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "authorization failed!"
            });
            
        if(!req.body.tweetContent) {
            return res.status(404).json({
                message: "tweetContent is a required field!"
            });
        }

        const user = await User.findById(req.userId);

        if(!user)
            return res.status(404).json({
                message: "user information not found!"
            });
        
        const body = {
            sUserName: user.sUserName,
            sContent: req.body.tweetContent
        }

        const newTweet = await Tweet.create(body);

        res.status(200).json({
            message: "Tweet was created successfully!"
        });

    } catch(error) {
        console.log(error.message);
        return res.status(501).json({
            message: "something went wrong!",
            exception: error.message
        });
    }
}

module.exports = {
    createTweet
}