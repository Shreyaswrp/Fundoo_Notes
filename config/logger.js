const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "./log/info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "./log/error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "./log/warning.log",
      level: "warning",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "./log/debug.log",
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
