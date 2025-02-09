const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    sUserName: {
        type: String,
        require: [true, "sUserName is a required field"]
    },
    sContent: {
        type: String,
        require: true,
        minLength: [5, "Tweet content should be atleast of 5 char long"],
        maxLength: [500, "Tweet content should not be more then 500 chars long"]
    },
    eTweetReach: {
        type: String,
        enum: ["everyone", "followers"],
        default: "everyone"
    },
    aTweetLikes: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, "sUserId is a required field to like a tweet"]
            }
        }
    ],
    aRetweet: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, "sUserId is a required field to retweet on a tweet"]
            }
        }
    ],
    aComment: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users',
                require: [true, "sUserId is a required field to commenting a tweet"]
            },
            sCommentText: {
                type: String,
                require: [true, "sCommentText is a required field for adding a comment"]
            }
        }
    ],
    eStatus: {
        type: String,
        enum: ["y", "n", "d"],
        default: "y"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tweet', tweetSchema);