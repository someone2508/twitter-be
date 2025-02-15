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

module.exports = {
    followUser
}