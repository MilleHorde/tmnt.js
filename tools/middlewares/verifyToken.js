"use strict";
const config = require('../../config');
const models = require('../../models');
const jwt = require('jsonwebtoken');

let verifyJWTAsync = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secretJWT, { algorithms: ['HS512'] }, (err, decoded) => {
      if(err){
        reject(err);
      }
      resolve(decoded);
    })
  });
};

let middleware = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    verifyJWTAsync(token)
      .then((decoded) => {
        return models.User.findById(decoded.id)
      })
      .then((user) => {
        req.user = user;
        return next();
      })
      .catch((err) => {
        return res.status(403).json({
          "error": "Expired token or not good"
        });
      });
  } else {
    return res.status(403).json({
      "error": "Token missing"
    });
  }
};

module.exports = middleware;