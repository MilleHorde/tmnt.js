"use strict";
const mongoose = require('mongoose');
const tools = require('../tools');
const crypto = require('crypto');
const config = require('../config');

let label = "User";

let schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {type: String, unique: true},
  password: String,
  token: String,
  created: {type: Date, default: Date.now()},
  updated: {type: Date, default: Date.now()}
});

let model = mongoose.model(label, schema);

let methods = {
  findById : (id) => {
    return model
      .findById(id);
  },
  find : (query) => {
    return model
      .find(query);
  },
  findAndPopulate : (query) => {
    return model
      .find(query)
      .populate();
  },
  findByIdAndPopulate : (id) => {
    return model
      .findById(id)
      .populate();
  },
  create : (schema) => {
    let tmp = new model(schema);
    return tmp
      .save();
  },
  update : (query, schema, options) => {
    schema.updated = Date.now();
    if(schema.password){
      schema.password = crypto.createHash('sha512').update(schema.password).update(config.saltPassword).digest("hex");
    }
    return model
      .findOneAndUpdate(query, schema, options);
  },
  remove : (query) => {
    return model
      .remove(query);
  },
  findOne : (query) => {
    return model
      .findOne(query);
  },
  specials : {
    signup : (schema) => {
      let newUser = new model(schema);
      newUser.password = crypto.createHash('sha512').update(schema.password).update(config.saltPassword).digest("hex");
      return tools.generateToken(newUser._id.toString())
        .then((tokenObj) => {
          newUser.token = tokenObj.token;
          return newUser.save();
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            resolve(newUser.token);
          })
        })
    },
    signin : (data) => {
      let userTmp;
      return methods.findOne({email :data.email})
        .then((user) => {
          return new Promise((resolve, reject) => {
            if(!user){
              reject("No user found");
            }
            let newHash = crypto.createHash('sha512').update(data.password).update(config.saltPassword).digest("hex");
            if(newHash !== user.password){
              reject("Password not good")
            }
            resolve(user);
          });
        })
        .then((user) => {
          userTmp = user;
          return tools.verifyJWTAsync(user.token)
        })
        .catch((err) => {
          if(err.name === "TokenExpiredError"){
            return tools.generateToken((userTmp._id));
          }
          throw err
        })
        .then((tokenObj) => {
          return methods.update({_id: tokenObj.id}, {$set: {token: tokenObj.token}})
            .then(() => {
              return new Promise((resolve, reject) => {
                resolve(tokenObj.token);
              })
            })
        })
    }
  }
};

module.exports = {
  label: label,
  methods : methods
};