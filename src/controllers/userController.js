const User = require('../models/User');

const followUser = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "user is not authorised!"
            });
        
        const user = await User.findOne({_id: req.userId, eStatus: "y"});

        if(!user)
            return res.status(401).json({
                message: "user with the given user info was not found!"
            });

        if(!req.body.followUserId)
            return res.status(404).json({
                message: "followUserId is a required field!"
            });
        
        const followUser = await User.findOne({_id: req.body.followUserId, eStatus: "y"});

        if(!followUser)
            return res.status(400).json({
                message: "no valid user by the given followUserId was found!"
            });

        const followingUsers = user.aFollowing;

        console.log(followingUsers);

        // check if i am already following the followUser
        const isAlreadyFollowing = followingUsers.filter((e) => e.sUserId.toString() == followUser._id);

        console.log(isAlreadyFollowing);

        if(isAlreadyFollowing && isAlreadyFollowing.length > 0)
            return res.status(400).json({
                message: "already following!"
            });

        followingUsers.push({
            sUserId: followUser._id
        });
        
        const updatedInfo = await User.updateOne({_id: user._id}, {aFollowing: followingUsers});

        console.log(updatedInfo);

        res.status(200).json({
            message: "following details have been updated!"
        });
    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const unfollowUser = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "unauthorised access!"
            });
        
        const user = await User.findOne({_id: req.userId, eStatus: "y"});

        if(!user)
            return res.status(401).json({
                message: "active user with the given user info is not found!"
            });
        
        if(!req.body.unFollowUserId)
            return res.status(404).json({
                message: "unFollowUserId is a required field!"
            });

        let userIdx = user.aFollowing.findIndex((user) => user.sUserId.toString() == req.body.unFollowUserId);

        if(userIdx == -1)
            return res.status(400).json({
                message: "trying to unfollow a user which is not even followed!"
            });
        
        const unfollowUser = await User.findOne({_id: req.body.unFollowUserId, eStatus: "y"});

        if(!unfollowUser)
            return res.status(404).json({
                message: "an active user with the given userId to unfollow is not found!"
            });
        
        user.aFollowing.splice(userIdx, 1);
        
        const response = await user.save();
        console.log(response);

        res.status(200).json({
            message: "user unfollowed successfully!"
        });

    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

const deleteMe = async (req, res) => {
    try {
        if(!req.userId)
            return res.status(401).json({
                message: "authorised access"
            });

        const user = await User.findOne({_id: req.userId, eStatus: "y"});

        if(!user)
            return res.status(401).json({
                message: "active user details not found!"
            });
        
        user.eStatus = "d";
        await user.save();

        res.status(200).json({
            message: "user is deleted successfully!"
        });

    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

module.exports = {
    followUser,
    unfollowUser,
    deleteMe
}