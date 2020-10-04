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

  /**
    * Retrieve and return all users from the database.
    */
    findAllUsers = (data,callback) => {
        USER.find(data,function(err,result) {
            if(err)return callback(err,null);
            return callback(null,result);
        })
    }

  /**
    * Find a single user with a userId
    */
    findOneUser = (idUser,callback) => {
        USER.findById(idUser,function(err,data){
            if(err)return callback(err,null);
            return callback(null,data);
        })
    }

  /**
    * Update a user identified by the userId in the request
    */
    updateUser = (id, data, callback) => {
        try{
        USER.findByIdAndUpdate(id, data, function (err, post){
            if (err) return next(err);
            callback(null, post);
        })
        }
        catch(err) {
            callback(err,null);
        }    
    }

  /**
    * Delete a user with the specified userId in the request
    */
    deleteUser = (idGreeting,callback) => {
        try{
        USER.findByIdAndDelete(idGreeting, function(err,post){
            if (err) return next(err);
            callback(null,'User deleted successfully');
        })
        }catch(err){
            callback(err,null);
        }
    }
}

module.exports = new UserModel();
