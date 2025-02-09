const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    sUserName: {
        type: String,
        unique: true,
        require: true
    },
    sEmail: {
        type: String,
        unique: true,
        require: true
    },
    sPassword: {
        type: String,
        required: true
    },
    oName: {
        sFirstName: String,
        sLastName: String
    },
    sRole: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    aFollowing: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                require: [true, "sUserId is a required field in aFollowing"]
            }
        }
    ],
    aFollowers: [
        {
            sUserId: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                require: [true, "sUserId is a required field in aFollowers"]
            }
        }
    ],
    sSalt: {
        type: String,
        require: true
    },
    eStatus: {
        type: String,
        enum: ["y", "n", "d"],   // y=active, n=blocked, d=deleted
        default: "y"
    },
    sProfilePictureUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);