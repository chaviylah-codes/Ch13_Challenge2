const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');


const handleNewUser = async (req, res) => {
    const { firstname, lastname, password, email, role} = req.body;
    if (!firstname || !lastname || !password || !email || !role){
        return res.status(400).json({'message': "All fields Required"})
    }
    //check existing user
    const duplicate = usersDB.users.find(person => person.email === email)
    if (duplicate) {
        return res.sendStatus(409);
        
    }
    try {
        //encrypt password
        const hashedPwd = await bcrypt.hash(password, 10);
        //store the new user
        const newUser = {'firstname': firstname, 'lastname': lastname,
        'role' : role, 'email' : email,
        'password': hashedPwd}
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({'message' : `User ${email} created successfully`})
    } catch (err) {
        return res.status(500).json({'message' : err.message})
    }
}


module.exports = {handleNewUser};
