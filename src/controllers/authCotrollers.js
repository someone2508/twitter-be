const User = require('../models/User');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const jwt = require('jsonwebtoken')

function isEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isPasswordStrong(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}


// pass: amit@123 -> y65rdfhj -> ytfjuyt5r5rfy6tyu7ytyutytrrer4er5rt

// pass: amit@123 -> y65rdfhj -> ytfjuyt5r5rfy6tyu7ytyutytrrer4er5rt

// wrong pass amit@124 -> y65rdfhj -> ytfjuyt5r5rfy6tyu7ytyutytrruyfghjhyt

async function encryptPasword(password) {
    const salt = crypto.randomBytes(8).toString("hex");
    let hashedPassword = await scrypt(password, salt, 64);
    hashedPassword = hashedPassword.toString("hex");
    return {
        hashedPassword,
        salt
    }
}

async function verifyPassword(password, salt, originalHashedPassword) {
    console.log(password +  " : " + salt + " : " + originalHashedPassword);
    let hashedPassword = await scrypt(password, salt, 64);

    hashedPassword = hashedPassword.toString('hex');

    return hashedPassword === originalHashedPassword;
}

function createToken(userId, expTime = '60m') {
    try {
        return jwt.sign({id: userId}, process.env.JWT_SECRET);
    } catch(error) {
        console.log(error);
        return undefined;
    }
}

const register = async (req, res) => {
    try {
        console.log(req.body);
        if(!req.body.sUserName) 
            return res.json({
                message: "sUserName is a required field for registration"
            });
        if(!req.body.sEmail) 
            return res.json({
                message: "sEmail is a required field for registration"
            });
        if(!req.body.sPassword) 
            return res.json({
                message: "sPassword is a required field for registration"
            });
        
        if(req.body.sPassword !== req.body.confirmPassword)
            return res.json({
                message: "sPassword and confirmPassword does not match!"
            });

        
        if(!isEmail(req.body.sEmail))
            return res.json({
                message: "sEmail is not a valid email address"
            });

        if(!isPasswordStrong(req.body.sPassword))
            return res.json({
                message: "sPassword is not strong enough"
            });
        
        let body = {
            sUserName: req.body.sUserName,
            sPassword: req.body.sPassword,
            sEmail: req.body.sEmail
        }

        const query = {
            $or: [{sEmail: body.sEmail}, {sUserName: body.sUserName}]
        }

        const user = await User.findOne(query);

        if(user) {
            if(user.sUserName === body.sUserName)
                return res.json({
                    message: "User with the same username already exist!"
                });
            if(user.sEmail === body.sEmail)
                return res.json({
                    message: "User with the same email already exist!"
                });
        }

        let {hashedPassword, salt} = await encryptPasword(body.sPassword);


        body.sPassword = hashedPassword;
        body.sSalt = salt;

        const newUser = await User.create(body);    

        const token = createToken(newUser._id);

        console.log(token);

        res.json({
            message: "User has been registered sucessfully!",
            token
        });
    } catch(error) {
        console.log(error);
        return res.json({
            message: "something went wrong!"
        });
    }
}

const login = async(req, res) => {
    try {
        if(!req.body.sEmail) 
            return res.json({
                message: "sEmail is a required field for registration"
            });
        if(!req.body.sPassword) 
            return res.json({
                message: "sPassword is a required field for registration"
            });

        const body = {
            sEmail: req.body.sEmail,
            sPassword: req.body.sPassword
        }

        let user = await User.findOne({sEmail: body.sEmail});

        if(!user) return res.status(404).json({
            message: "user with the given email address not found!"
        });

        console.log(user);

        console.log(body.sPassword + " : ");

        let isPasswordValid = await verifyPassword(body.sPassword, user.sSalt, user.sPassword);

        if(!isPasswordValid)
            return res.status(401).json({
                message: "given password is incorrect!"
            });

        const token = await createToken(user._id);

        res.status(200).json({
            message: "user has been logged in successfully!",
            token
        });

    } catch(error) {
        console.log(error);
        res.status(501).json({
            message: "something went wrong!"
        });
    }
}

module.exports = {
    register,
    login
}