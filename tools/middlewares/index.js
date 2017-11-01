"use strict";
const fs = require('fs');
const constants = require('../../constants');

let checkObject = (req, res, next) => {
  let path = req.baseUrl.replace('/', '');
  let config = constants.config[path];
  let objToCheck = req.body;
  return new Promise((resolve, reject) => {
    Object.keys(config).forEach((key) => {
      if (config[key].required.includes(req.method.toLowerCase()) && !objToCheck[key]) {
        reject(`${key} is missing`);
      }
      if (objToCheck[key]) {
        if (typeof objToCheck[key] !== config[key].type) {
          reject(`${key} is not a ${config[key].type}`);
        }
        if (config[key].format) {
          let reg = new RegExp(config[key].format, 'g');
          if (!reg.test(objToCheck[key])) {
            reject(`${key} doesn't have good format`)
          }
        }
      }
    });
    resolve(objToCheck);
  })
    .then((obj) => {
      req.validated = obj;
      next();
    })
    .catch((err) => {
      res.status(500).send({"Error": err.message || err});
    });
};

let authorized = (req, res, next) => {
  if(req.user._id.toString() === req.params.id.toString()){
    next();
  }else{
    res.status(401).send({"Error": "not allowed"});
  }
};

module.exports = {
  verifyToken: require('./verifyToken'),
  checkObject,
  authorized
};