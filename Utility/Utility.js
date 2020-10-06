const jwt = require('jsonwebtoken');

exports.generateToken = (data) => { 
    const token = jwt.sign({data}, 'secretkey');
    return token;
}

