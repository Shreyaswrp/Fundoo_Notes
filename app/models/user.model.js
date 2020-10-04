const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
    firstName: {
        type: String,
        min: 3,
        required: true,
    },
    lastName: {
        type: String,
        min: 3,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        min: 8,
        required: true,
    }
});

const USER = mongoose.model('User', UserSchema);

class UserModel {

  /**
    * Create and Save a new User
    */
    createUser = (data, callback) => {
        let saltRounds = 10;
        try{
        bcrypt.hash(data.password, saltRounds, function (err, hash) {
            // Store password in hash form in DB
            const user = new USER({
            firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  password: hash,
            });
        //save user in database    
        user.save();
        callback(null, user);
        });
        }
        catch(err){
        callback(err,null);
        }
    }  
}

module.exports = new UserModel();
