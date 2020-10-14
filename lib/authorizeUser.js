const jwt = require("jsonwebtoken");
const User = require("../app/models/userModel.js");
const utility = require("../utility/utility.js");

exports.authorizeUser = (req, res, callback) => {
  var responseResult = {};
  if (!req.headers.token) {
    responseResult.success = false;
    responseResult.message = "Not authorized to access to this route";
    res.status(422).send(responseResult);
  }
  const token = utility.verifyToken(req.headers.token);
  obj = {
    emailId: token.data.emailId,
  };
  return User.findUser(obj, callback);
};
