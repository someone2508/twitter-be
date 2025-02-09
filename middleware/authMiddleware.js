const jwt = require('jsonwebtoken');
const middleware = {};

middleware.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token)
            return res.status(401).json({
                message: "Auth token is not found!"
            });

        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if(err)
                return res.status(401).json({
                    message: "given auth token is not valid!"
                });
            
            console.log(decoded);
            req.userId = decoded.id;
            next();
        });

    } catch(error) {
        console.log(error);
        return res.status(501).json({
            message: "something went wrong!"
        });
    }
}

module.exports = middleware;