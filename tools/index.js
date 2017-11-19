"use strict";
const jwt = require('jsonwebtoken');
const config = require('../config');
const middlewares = require('./middlewares');
const constants = require('../constants');
const logger = require('morgan');
const socket = require('./socket');

//FUNCTION normalizePort
//@param val port to normalize
let normalizePort = (val) => {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//FUNCTION onError
//@param error error to log
let onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//FUNCTION onListening
//@param server server to show port listening
let onListening = (server) => {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger('Listening on ' + bind);
  return 'Listening on ' + bind;
};

//FUNCTION generateToken
//@param id id of user to generate token
//This function generate token of user with this id, for 7 days in HS 512
let generateToken = (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign({id: id}, config.secretJWT, {expiresIn: '7d', algorithm: 'HS512'}, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve({id: id, token: token});
    })
  })
};

//FUNCTION verifyJWTAsync
//@param token token to check
//This function check if token is good or not and decode this if necessary
let verifyJWTAsync = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secretJWT, {algorithms: ['HS512']}, (err, decoded) => {
      if (err) {
        reject(err);
      }
      decoded.token = token;
      resolve(decoded);
    })
  });
};

//FUNCTION dto
//@param obj obj to sort
//@param path path of config
//This function sort object to return only value authorized in config
let dto = (obj, path) => {
  let conf = constants.dto[path];
  let results = {};
  Object.keys(conf).forEach((key) => {
    if(conf[key] && obj[key]){
      results[key] = obj[key];
    }
  });
  return results;
};

module.exports = {
  normalizePort,
  onError,
  onListening,
  generateToken,
  verifyJWTAsync,
  dto,
  socket: socket,
  middlewares: middlewares
};