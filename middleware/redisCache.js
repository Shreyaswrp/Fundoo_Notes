const redis = require("redis");
const port_redis = process.env.REDIS_PORT || 6379;
const redis_client = redis.createClient(port_redis);

class RedisCache {

  //get all the notes from cache
  getAllNotes = (req, res, next) => {
    var responseResult = {};
    redis_client.get("notes", (err, result) => {
      if (err) {
        throw err;
      } else if (result != null) {
          responseResult.success = true;
          responseResult.data = JSON.parse(result);
          responseResult.message = "Notes found successfully from cache.";
          return res.status(200).send(responseResult);
      }else {
      return next();
      }
    });
  };

  //get all the notes of logged in user from cache
  getAllNotesOfUser = (req, res, next) => {
    var responseResult = {};
    redis_client.get("notesOfUser", (err, result) => {
      if (err) {
        throw err;
      } else if (result != null) {
          responseResult.success = true;
          responseResult.data = JSON.parse(result);
          responseResult.message = "Notes found successfully from cache.";
          return res.status(200).send(responseResult);
      }else {
      return next();
      }
    });
  };

  //get all the notes from cache
  getAllLabels = (req, res, next) => {
    var responseResult = {};
    redis_client.get("labels", (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result != null) {
          responseResult.success = true;
          responseResult.data = JSON.parse(result);
          responseResult.message = "Labels found successfully from cache.";
          return res.status(200).send(responseResult);
        }
    }
      return next();
    });
  };

  //set all the notes to cache
  setAllNotes = (data) => {
    redis_client.setex("notes", 3600, JSON.stringify(data));
  };

  //set all the notes of a logged in user to cache
  setUserAllNotes = (data) => {
    redis_client.setex("notesOfUser", 3600, JSON.stringify(data));
  };

  //set all the labels to cache
  setAllLabels = (data) => {
    redis_client.setex("labels", 3600, JSON.stringify(data));
  };

  //to clear cache before use
  clearCache = () => {
    redis_client.flushall();
  }
}

module.exports = new RedisCache();
