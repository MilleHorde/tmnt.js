"use strict";
const mongoose = require('mongoose');
const models = require('../models');

let label = "Pizza";

let schema = new mongoose.Schema({
  name: {type: String, unique: true},
  image: {type: Buffer},
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
      .populate("ingredients cook history");
  },
  find : (query) => {
    return model
      .find(query);
  },
  findAndPopulate : (query) => {
    return model
      .find(query)
      .populate("ingredients cook history");
  },
  create : (schema) => {
    let tmp = new model(schema);
    if(tmp.image){
      tmp.image = new Buffer(tmp.image, 'base64');
    }
    return tmp
      .save();
  },
  update : (query, schema, options) => {
    schema.updated = Date.now();
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
  }
};

module.exports = {
  label: label,
  methods : methods
};