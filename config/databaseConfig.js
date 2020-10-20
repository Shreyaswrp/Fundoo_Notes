var mongoose = require("mongoose");
logger = require("./logger");
config = require("dotenv/config");

mongoose.connection.on("connecting", function () {
  logger.info("trying to establish a connection to mongo");
});

mongoose.connection.on("connected", function () {
  logger.info("connection established successfully");
});

mongoose.connection.on("error", function (err) {
  logger.error("connection to mongo failed " + err);
});

mongoose.connection.on("disconnected", function () {
  logger.info("mongo db connection closed");
});

var db = mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

var gracefulExit = function () {
  db.close(function () {
    logger.log(
      "mongoose connection with db " + process.env.DB_CONNECTION + "is closing"
    );
    process.exit(0);
  });
};

module.exports = db;
