const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
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
      min: 3,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      min: 8,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", UserSchema);

class UserModel {
  /**
   * @params {object} data
   * @params {callback function} callback
   * @description create a new user in the database
   */
  createUser = (data, callback) => {
    const userData = new userModel({
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      password: data.password,
    });
    return userData.save(callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description find a user in the database
   */
  findUser = (data, callback) => {
    return userModel.findOne({ emailId: data.emailId }, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description find a user in the database
   */
  findUserById = (data, callback) => {
    return userModel.findById({ _id: data }, callback);
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update user's password in the database
   */
  updateUser = (data, callback) => {
    return userModel.updateOne(
      { emailId: data.emailId },
      { password: data.password },
      callback
    );
  };

  /**
   * @params {object} data
   * @params {callback function} callback
   * @description update user's email verification field in the database
   */
  updateUserEmailVerification = (data, callback) => {
    return userModel.updateOne(
      { emailId: data.emailId },
      { isEmailVerified: data.isEmailVerified },
      callback
    );
  };
}

module.exports = new UserModel();
