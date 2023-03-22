const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises
const path = require('path');

const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({'message' : "email and password required"})
    }
    const foundUser =usersDB.users.find(person => person.email === email);
    if(!foundUser){
      return res.sendStatus(401); //Unauthorized
    }
        const match = await bcrypt.compare(password, foundUser.password);
        if(match){
            const role = Object.values(foundUser.role);
            //create JWTs
            const accessToken = jwt.sign(
                {"UserInfo" :{"email" : foundUser.email, "role": role}},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '120s'}
            );
            const refreshToken = jwt.sign(
                {"email" : foundUser.email},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'}
            );
            const otherUsers = usersDB.users.filter(person => person.email !== foundUser.email);
            const currentUser = {...foundUser, refreshToken};
            usersDB.setUsers([...otherUsers, currentUser]);
            await fsPromises.writeFile(
                path.join(__dirname, '..', 'model', 'users.json'),
                JSON.stringify(usersDB.users)
            );
            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
            res.json({ accessToken});
            // res.json({'Success': `User ${user} is logged in`})
        }
        else{
            res.sendStatus(401);
        }
    }

module.exports = {handleLogin};

