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

