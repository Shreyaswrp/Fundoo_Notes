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
    emailUser: {
        type: String,
        unique: true,
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
    registerUser = (data, callback) => {
        try{
            const user = new USER({
            firstName: data.firstName,
            lastName: data.lastName,
            emailUser: data.emailUser,
            password: data.password
            });
        //save user in database    
        user.save();
        callback(null, user);
        }
        catch(err){
        callback(err,null);
        }
    }

    loginUser = (data,callback) => {
        USER.findOne({ emailUser: data.emailUser }, (err,result) => {
            if (err) {
                callback(err,null);
            }else if( data != null ){
                callback(null,result);
            }else{
                callback("user not found");
            }     
        });
    }
}

module.exports = new UserModel();
