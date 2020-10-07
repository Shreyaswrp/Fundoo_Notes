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
    emailId: {
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

const userModel = mongoose.model('User', UserSchema);

class UserModel {

  /**
    * Create and Save a new User
    */
    registerUser = (data, callback) => {

        userModel.findOne( { emailId: data.emailId}, (err, result) => {
            if(err){
                callback(err, null);
            }else if(result != null){
                callback(null, 'email_exist');
            }else{
                const user = new userModel({
                firstName: data.firstName,
                lastName: data.lastName,
                emailId: data.emailId,
                password: data.password
                });
                //save user in database    
                user.save();
                callback(null, user);
            }
        })
    }

    /**
    * login a  User
    */
    loginUser = (data,callback) => {

        if( data != null){
        userModel.findOne( data.emailId, (err,result) => {
            if (err) {
                callback(err,null);
            }else{
                callback(null,result);
            }
        });    
        }else{
            callback("user not found");
        }     
    }

    /**
    * when forgot password send a token to reset
    */
    forgotPassword = (email, token, callback) => {
        userModel.findOne( { emailUser: email }, (err, user) => {
            if ( err || !user) {
                callback('user_not_exist',null);
            }else{
            return user.updateOne({resetLink: token}, (err, success) => {
                if(err){
                    callback(err, null);
                }else {
                    callback(null,success);
                }
                })
            }
        })
    }
}

module.exports = new UserModel();
