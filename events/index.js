"use strict";
const Event = require('../singleton');
const models = require('../models');

Event.on("pizzas.get", (res) => {
  return models.Pizza.find({})
    .then((pizzas) => {
      return res.json(pizzas);
    })
});

Event.on("pizzas.add", (res, data) => {
  return models.Pizza.create(data)
    .then(() => {
      return res.json({response : true});
    })
});

Event.on("pizzas.get.id", (res, id) => {
  return models.Pizza.findById(id)
    .then((pizza) => {
      return res.json(pizza);
    })
});

Event.on("pizzas.get.custom", (res, query) => {
  return models.Pizza.find(query)
    .then((pizzas) => {
      return res.json(pizzas);
    })
});

Event.on("pizzas.update", (res, query, data) => {
  return models.Pizza.update(query, data)
    .then(() => {
      return res.json({response : true});
    })
});

Event.on("pizzas.remove", (res, query) => {
  return models.Pizza.remove(query)
    .then(() => {
      return res.json({response : true});
    })
});