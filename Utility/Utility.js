const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken');

exports.generateToken = (data) => { 
    const token = jwt.sign({data}, process.env.TOKEN_SECRET, {expiresIn: '24h'});
    return token;
}

exports.verifyToken = (data) => {
    const decoded = jwt.verify(data, process.env.TOKEN_SECRET);
    return decoded;
}

exports.hashPassword = (user) => {
    const password = user.password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password,saltRounds);
    return hashedPassword
}

exports.comparePasswords =  (pass1, pass2) => {
       if(bcrypt.compareSync(pass1, pass2)){
           return true;
       }else{
           return false;
       }
}