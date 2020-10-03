const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const USER = mongoose.model('User', UserSchema);

class UserModel {

  /**
    * Create and Save a new User
    */
    createUser = (data, callback) => {

        try{
        const user = new USER ({
           firstName: data.firstName,
           lastName: data.lastName,
           email: data.email,
           password: data.password 
        });
        user.save();
        callback(null, user);
        }catch(err){
        callback(err,null);
        }
    }
}