const jwt = require("jsonwebtoken");
const utility = require("../utility/utility.js");
const user = require('../controller/userController.js');

//middleware to authorize user
exports.authorizeUser = (req, res, next) => {
  var responseResult = {};
    if (!req.headers.token) {
      responseResult.success = false;
      responseResult.message = "Not authorized to access this route";
      return res.status(422).send(responseResult);
    }else {
      const decodedValue = utility.verifyToken(req.headers.token);
        if (!decodedValue) {
          responseResult.success = false;
          responseResult.message = "You are logged out.Please login again.";
          return res.status(422).send(responseResult);
        }else {
          return user.getAuthorizedUser(decodedValue.data, next);
        }
    }
};
