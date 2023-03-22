const jwt = require ('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }
        console.log(authHeader);//bearer token
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.sendStatus(403)
                }
                req.email = decoded.UserInfo.email;
                req.role = decoded.UserInfo.role;
                next();
            }
        );
    }

    module.exports = verifyJWT;


