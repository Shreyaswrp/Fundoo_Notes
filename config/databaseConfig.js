var DEBUG_CONNECTING            = 'Connecting to db server %s...';
var DEBUG_ALREADY_CONNECTED     = 'Already connected to db server %s.';
var DEBUG_ALREADY_CONNECTING    = 'Already connecting to db server %s.';
var DEBUG_CONNECTED             = 'Successfully connected to db server %s.';
var DEBUG_CONNECTION_ERROR      = 'An error has occured while connecting to db server %s.';
var DEBUG_DISCONNECTING         = 'Disconnecting from db server %s...';
var DEBUG_ALREADY_DISCONNECTED  = 'Already disconnected from db server %s.';
var DEBUG_ALREADY_DISCONNECTING = 'Already disconnecting from db server %s.';
var DEBUG_DISCONNECTED          = 'Successfully disconnected from db server %s.';
var DEBUG_DISCONNECTION_ERROR   = 'An error has occured while disconnecting from db server %s.';
 
var blueBird    = require('bluebird');
var mongoose    = require('mongoose');
var debug       = require('debug');
const logger = require('./logger');
require('dotenv/config');

class MongoDBAdapter {

/**
* @constructor
* @param {string} uri     - Mongoose connection URI.
* @param {object} options - Mongoose connection options.
*/  
MongoDBAdapter = (uri, options) => {
  this.uri     = uri;
  this.options = options;
}

//returns states of mongodb connection
isState = (state) => {
  return mongoose.connection.readyState === mongoose.Connection.STATES[state];
};

/**
 * @description Add connection listeners without adding more than one for each event.
 */
addConnectionListener = (event, cb) => {
  var listeners = mongoose.connection._events;
  if (!listeners || !listeners[event] || listeners[event].length === 0){
    mongoose.connection.once(event, cb.bind(this));
  }
};
  
/**
 * @description Returns a promise that gets resolved when successfully connected to MongoDB URI, or rejected otherwise.
 * @returns {Promise} Returns promise
*/
connect = () => {
  return new blueBird((resolve, reject) => {
    if (this.isState('connected')){
      d(DEBUG_ALREADY_CONNECTED, this.uri);
      return resolve(this.uri);
    }

    this.addConnectionListener('error', (err) => {
      d(DEBUG_CONNECTION_ERROR, this.uri);
      return reject(err);
    });
  
    this.addConnectionListener('open', () =>{
      d(DEBUG_CONNECTED, this.uri);
      return resolve(this.uri);
    });
  
    if (this.isState('connecting')){
      d(DEBUG_ALREADY_CONNECTING, this.uri);
    } else {
      d(DEBUG_CONNECTING, this.uri);
      mongoose.connect(this.uri, this.options);
    }

  }).bind(this);
};
  
/**
 * @description Returns a promise that gets resolved when successfully disconnected from MongoDB URI, or rejected otherwise.
 * @return {Promise} Bluebird promise
*/
disconnect = () => {
  return new blueBird((resolve, reject) => {
    if (isState('disconnected') || isState('uninitialized')){
      d(DEBUG_ALREADY_DISCONNECTED, this.uri);
      return resolve(this.uri);
    }
  
    this.addConnectionListener('error', (err) => {
      d(DEBUG_DISCONNECTION_ERROR, this.uri);
      return reject(err);
    });
  
    this.addConnectionListener('disconnected', () => {
      d(DEBUG_DISCONNECTED, this.uri);
      return resolve(this.uri);
    });
  
    if (isState('disconnecting')){
      d(DEBUG_ALREADY_DISCONNECTING, this.uri);
    } else {
      d(DEBUG_DISCONNECTING, this.uri);
      mongoose.disconnect();
    }
  }).bind(this);
};

  //Connecting to the database
  DB_CONFIG = mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
    }).then(() => {
      logger.log('info', "Successfully connected to the database");
      return mongoose.disconnect();    
    }).catch(err => {
      logger.log('error', 'Could not connect to the database. Exiting now...', err);
      process.exit();
  });
}

const d = debug(new MongoDBAdapter());

// Export the mongodb connection instance
module.exports = new MongoDBAdapter(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
 