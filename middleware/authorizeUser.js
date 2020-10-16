const jwt = require("jsonwebtoken");
const User = require("../app/models/userModel.js");
const utility = require("../utility/utility.js");

//middleware to authorize user
exports.authorizeUser = (req, res, next) => {
  var responseResult = {};
  if (!req.headers.token) {
    responseResult.success = false;
    responseResult.message = "Not authorized to access to this route";
    res.status(422).send(responseResult);
  }
  const token = utility.verifyToken(req.headers.token);
  return User.findUserById(token.data, next);
};
