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

const deleteTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "User is not authorised!"
            });
            
        const user = await User.findOne({_id: req.userId, eStatus: "y"});

        if(!user)
            return res.status(401).json({
                message: "User details are not found or not active!"
            });
        
        if(!req.body.tweetId)
            return res.status(404).json({
                message: "tweetId is required for processing deletion"
            });
        
        const tweet = await Tweet.findOne({_id: req.body.tweetId, sUserName: user.sUserName, eStatus: "y"});

        if(!tweet)
            return res.status(401).json({
                message: "The tweet does not belong to the given user"
            });
        
        const response = await Tweet.updateOne({_id: req.body.tweetId}, {eStatus: "d"});

        console.log(response);

        res.status(200).json({
            message: "the tweet was deleted successfully!"
        });

    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const getTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "user is not authorised!"
            });

        const user = await User.findOne({_id: req.userId, eStatus: "y"});

        if(!user)
            return res.status(404).json({
                message: "user infor is not found!"
            });

        let aFollowingUsers = user.aFollowing;
        let aTweets = [];

        for(let i=0; i<aFollowingUsers.length; i++) {
            let eUser = aFollowingUsers[i];

            const user = await User.findOne({_id: eUser.sUserId, eStatus: "y"});

            if(!user)
                return;
            
            const tweets = await Tweet.find({sUserName: user.sUserName, eStatus: "y"}, {sUserName: 1, sContent: 1, aTweetLikes: 1, aComment: 1, _id: 0});

            aTweets = [...aTweets, ...tweets];

            console.log("Line 113");
            console.log(aTweets);
        };

        console.log("Line 114");
        console.log(aTweets);

        return res.status(200).json({
            message: "tweet feed has been processed!",
            tweets: aTweets
        });

    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const likeTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "unauthorised access!"
            });
            
        const user = await User.findOne({_id: req.userId, eStatus: "y"});

        if(!user)
            return res.status(401).json({
                message: "active userInfo for the user is not found!"
            });

        if(!req.body.tweetId)
            return res.status(404).json({
                message: "tweetId is a requiredId"
            });
        
        const tweet = await Tweet.findOne({_id: req.body.tweetId, eStatus: "y"});

        if(!tweet)
            return res.status(404).json({
                message: "tweet witht the given tweetId is not found!"
            });
        
        const isAlreadyLiked = tweet.aTweetLikes.find(eUser => eUser.sUserId.toString() == user._id);

        if(isAlreadyLiked)
            return res.status(400).json({
                message: "user has already liked the tweet!"
            });
        
        tweet.aTweetLikes.push({
            sUserId: user._id
        });

        await tweet.save();

        res.status(200).json({
            message: "user has successfully liked the tweet!"
        });

    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const unlikeTweet = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "unauthorised access"
            });
        
        const user = await User.findOne({_id: req.userId, eStatus: "y"});

        if(!user)
            return res.status(404).json({
                message: "active user info with the given login details not found!"
            });
        
        if(!req.body.tweetId)
            return res.status(404).json({
                message: "tweetId is a required field!"
            });
        
        const tweet = await Tweet.findOne({_id: req.body.tweetId, eStatus: "y"});

        if(!tweet)
            return res.status(404).json({
                message: "tweet with the given tweetId is not found!"
            });
        
        const userIdx = tweet.aTweetLikes.findIndex((eUser) => eUser.sUserId.toString() == user._id);

        if(userIdx == -1)
            return res.status(400).json({
                message: "user has not yet liked the tweet!"
            });
        
        tweet.aTweetLikes.splice(userIdx, 1);

        await tweet.save();

        res.status(200).json({
            message: "user has unliked the tweet"
        });

    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        })
    }
}

module.exports = {
    createTweet,
    deleteTweet,
    getTweet,
    likeTweet,
    unlikeTweet
}