const bcrypt = require("bcrypt");
config = require("dotenv/config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

//generate token
exports.generateToken = (data) => {
  const token = jwt.sign({ data }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

//verify token
exports.verifyToken = (data) => {
  const decoded = jwt.verify(data, process.env.TOKEN_SECRET);
  return decoded;
};

//hash password
exports.hashPassword = (user) => {
  const password = user.password;
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
};

//compare password
exports.comparePasswords = (pass1, pass2) => {
  if (bcrypt.compareSync(pass1, pass2)) {
    return true;
  } else {
    return false;
  }
};

//validate user content
exports.validateUser = (message) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    emailId: Joi.string().min(3).required(),
  });
  return schema.validate(message);
};

//validate note
exports.validateNote = (message) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string(),
    userId: Joi.string(),
    reminder: Joi.string(),
    colour: Joi.string(),
    image: Joi.string(),
    isPinned: Joi.boolean(),
    isArchived: Joi.boolean(),
    isDeleted: Joi.boolean(),
  });
  return schema.validate(message);
};
