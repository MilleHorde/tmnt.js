"use strict";
const Event = require('../singleton');
const models = require('../models');
const tools = require('../tools');

/**
 * PIZZAS EVENTS
 */

Event.on("pizzas.get", (res) => {
  return models.Pizza.find({})
    .then((pizzas) => {
      return res.json(pizzas);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("pizzas.add", (res, data) => {
  return models.Pizza.create(data)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("pizzas.get.id", (res, id) => {
  return models.Pizza.findByIdAndPopulate(id)
    .then((pizza) => {
      return res.json(pizza);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("pizzas.get.custom", (res, query) => {
  return models.Pizza.find(query)
    .then((pizzas) => {
      return res.json(pizzas);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("pizzas.update", (res, query, data) => {
  return models.Pizza.update(query, data)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("pizzas.remove", (res, query) => {
  return models.Pizza.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});


/**
 * USERS EVENTS
 */

Event.on("users.get", (res) => {
  return models.User.find({})
    .then((users) => {
      let results = users.map((user)=>{
        return tools.dto(user, "users");
      });
      return res.json(results);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("users.signup", (res, req) => {
  let data = req.validated;
  return models.User.specials.signup(data)
    .then((token) => {
      return res.json({response: token});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("users.signin", (res, req) => {
  let data = req.validated;
  return models.User.specials.signin(data)
    .then((token) => {
      return res.json({response: token});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("users.get.id", (res, id) => {
  return models.User.findByIdAndPopulate(id)
    .then((pizza) => {
      return res.json(pizza);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("users.get.custom", (res, query) => {
  return models.User.find(query)
    .then((users) => {
      return res.json(users);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("users.update", (res, query, req) => {
  let data = req.validated;
  return models.User.update(query, data, {new : true})
    .then((data) => {
      return res.json({response: data});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("users.remove", (res, query) => {
  return models.User.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});


/**
 * INGREDIENTS EVENTS
 */

Event.on("ingredients.get", (res) => {
  return models.Ingredient.find({})
    .then((ingredients) => {
      return res.json(ingredients);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("ingredients.add", (res, data) => {
  return models.Ingredient.create(data)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("ingredients.get.id", (res, id) => {
  return models.Ingredient.findByIdAndPopulate(id)
    .then((pizza) => {
      return res.json(pizza);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("ingredients.get.custom", (res, query) => {
  return models.Ingredient.find(query)
    .then((pizzas) => {
      return res.json(pizzas);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("ingredients.update", (res, query, data) => {
  return models.Ingredient.update(query, data)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("ingredients.remove", (res, query) => {
  return models.Ingredient.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});


/**
 * HISTORIES EVENTS
 */

Event.on("histories.get", (res) => {
  return models.Ingredient.find({})
    .then((pizzas) => {
      return res.json(pizzas);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("histories.add", (res, data) => {
  return models.Ingredient.create(data)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("histories.get.id", (res, id) => {
  return models.Ingredient.findByIdAndPopulate(id)
    .then((pizza) => {
      return res.json(pizza);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("histories.get.custom", (res, query) => {
  return models.Ingredient.find(query)
    .then((pizzas) => {
      return res.json(pizzas);
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("histories.update", (res, query, data) => {
  return models.Ingredient.update(query, data)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});

Event.on("histories.remove", (res, query) => {
  return models.Ingredient.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err})
    })
});