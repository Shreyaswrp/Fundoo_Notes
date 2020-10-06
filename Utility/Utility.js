const jwt = require('jsonwebtoken');

exports.generateToken = (data) => { 
    const token = jwt.sign({data}, 'secretkey', {expiresIn: '20m'});
    return token;
}

exports.generateTokenForPasswordReset = (data) => { 
    const token = jwt.sign({data}, 'secretkey', {expiresIn: '20m'});
    return token;
}

