const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
    firstName: {
        type: String,
        trim: true,
        min: 3,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        min: 3,
        required: true,
    },
    emailUser: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        min: 8,
        required: true,
    },
    resetLink: {
        data: String,
        default: '',
    }
});

const USER = mongoose.model('User', UserSchema);

class UserModel {

  /**
    * Create and Save a new User
    */
    registerUser = (data, callback) => {
    
        USER.findOne({ emailUser: data.emailUser }, (err, result) => {
            if(err){
                callback(err, null);
            }else if(result != null){
                callback(null, 'email_exist');
            }else{
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
        })
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

    forgotPassword = (data, token, callback) => {
        USER.findOne( { emailUser: data }, (err, user) => {
            if ( err || !user) {
                callback('user_not_exist',null);
            }
        USER.updateOne({resetLink: token}, (err, success) => {
            if(err){
                callback(err, null);
            }else {
                callback(null,success);
            }
        })
    })
    }
}

module.exports = new UserModel();
