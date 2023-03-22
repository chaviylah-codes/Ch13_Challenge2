const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}


const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    const foundUser =usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser){
      return res.sendStatus(401); //Forbidden
    }
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded ) => {
            if (err || foundUser.email !== decoded.email){
                return res.sendStatus(403)
            }
            const roles = Object.values(foundUser.roles)
            const accessToken =  jwt.sign(
                {
                 "UserInfo":   {"email": decoded.email,
                "role": role}
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '30s'}
            );
            res.json({ accessToken})
        }
    )
            }

module.exports = { handleRefreshToken };

