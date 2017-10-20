"use strict";
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv').load({silent: true});
const config = require('../config');

exports.debug = (value) => {
  mongoose.set('debug', value !== false);
};

// Load all files under server/db/schemas/ and create mongoose schema
let loadModels = (app, options) => {
  return new Promise((resolve, reject) => {
    let path = __dirname;

    if (options.verbose !== false) {
      console.log('Loading MODELS');
    }

    fs.readdir(__dirname, (err, files) => {
      if(err){
        reject(err);
      }
      files.forEach((file) => {
        if (file !== "index.js") {
          let module = require(__dirname+'/'+file);
          console.log('    MODEL: ' + module.label);
          exports[module.label] = module.methods;
        }
      })
    });
    resolve(app);
  });
};

// connect to mongodb server
let connect = (app) => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    return mongoose.connect('mongodb://' + config.database.host + '/' + config.database.name, {useMongoClient: true})
      .then(() => {
        console.log("connection with mongoDB established")
        resolve();
      })
      .catch((err)=>{
        console.log(err);
        process.exit(1)
        reject(err)
      });
  });
};

exports.load = (app, options) => {
  delete exports.load;
  options = options || {};

  let promise = loadModels(app, options);

  promise = promise.then(connect);

  return promise;
};