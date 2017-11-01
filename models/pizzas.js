"use strict";
const mongoose = require('mongoose');

let label = "Pizza";

let schema = new mongoose.Schema({
  name: {type: String, unique: true},
  image: { data: Buffer, contentType: String },
  ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
  priceCts: Number,
  description: {type: String, maxLength: 500},
  created: {type: Date, default: Date.now()},
  updated: {type: Date, default: Date.now()},
  cook: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  history: [{type: mongoose.Schema.Types.ObjectId, ref: 'History'}]
});

let model = mongoose.model(label, schema);

let methods = {
  findById : (id) => {
    return model
      .findById(id);
  },
  findByIdAndPopulate : (id) => {
    return model
      .findById(id)
      .populate();
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