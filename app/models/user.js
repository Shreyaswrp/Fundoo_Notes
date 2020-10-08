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
    token: {
        data: String,
        default: '',
    }
});

const userModel = mongoose.model('User', UserSchema);

class UserModel {

  /**
    * @params {object} data
    * @params {callback function} callback
    * @description register a new user in the database
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
   * @params {object} data
   * @params {callback function} callback
   * @description let a user login by giving emaild id and password
   */
    loginUser = (data,callback) => {
        userModel.findOne( {emailId: data.emailId}, (err,result) => {
            if (err) {
                callback(err,null);
            }else{
                callback(null,result);
            }
        });    
    }  
        
 /**
   * @params {object} data
   * @params {callback function} callback
   * @description send reset link to recover password when it's forgotten 
   */
    forgotPassword = (data, callback) => {
        userModel.findOne( { emailId: data.emailId }, (err, user) => {
            if ( err || !user) {
                callback('user_not_exist',null);
            }else{
                callback(null, user);
            }
        })
    }

 /**
   * @params {object} data
   * @params {callback function} callback
   * @description update password by the reset link provided 
   */
    resetPassword = (data, callback) => {
        userModel.findOne( {emailId: data.emailId}, (err, result) => {
            if ( err || !result) {
                callback('invalid_reset_link',null);
            }else{
                userModel.updateOne({emailId: data.emailId},{password: data.password},(err, docs) => { 
                    if (err){ 
                        callback(err, null);
                    } 
                    else{ 
                        callback(null, docs);
                    } 
                }); 
            } 
        })
    }

}

    


module.exports = new UserModel();
