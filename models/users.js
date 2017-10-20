"use strict";
let mongoose = require('mongoose');

let label = "User";

let schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {type: String},
  password: String,
  login: String,
  token: String,
  created: {type: Date, default: Date.now()},
  updated: {type: Date, default: Date.now()},
  deleted: Date
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
  create : (schema) => {
    let tmp = new model(schema);
    return tmp
      .save();
  },
  update : (query, schema) => {
    return model
      .update(query, schema);
  },
  remove : (query) => {
    return model
      .remove(query);
  },
  findOne : (query) => {
    return model
      .findOne(query);
  }
};

module.exports = {
  label: label,
  methods : methods
};