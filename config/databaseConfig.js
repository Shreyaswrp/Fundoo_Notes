const logger = require('./logger');
// Configuring the database
require('dotenv/config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
const DB_CONFIG = mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, 'useCreateIndex': true
}).then(() => {
    logger.info("Successfully connected to the database");    
}).catch(err => {
    logger.error('Could not connect to the database. Exiting now...', err);
    process.exit();
});

module.exports = mongoose.DB_CONFIG;