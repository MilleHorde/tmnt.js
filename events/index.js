"use strict";
const Event = require('../singleton');
const models = require('../models');
const tools = require('../tools');

/**
 * PIZZAS EVENTS
 */

Event.on("pizzas.get", (res) => {
  return models.Pizza.findAndPopulate({})
    .then((pizzas) => {
      let results = pizzas.map((pizza) => {
        pizza.cook = tools.dto(pizza.cook, "users");
        pizza.ingredients = pizza.ingredients.map((ingredient) => {
          return tools.dto(ingredient, "ingredients");
        });
        return tools.dto(pizza, "pizzas");
      });
      return res.json({response: results});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("pizzas.add", (res, req) => {
  let data = req.validated;
  data.cook = req.user._id;
  data.history = [];

  return models.History.create({message: "Insert", userId: req.user._id})
    .then((history) => {
      data.history.push(history._id);
      return models.Pizza.create(data);
    })
    .then((pizza) => {
      return models.Pizza.findByIdAndPopulate(pizza._id);
    })
    .then((pizza) => {
      pizza.cook = tools.dto(pizza.cook, "users");
      pizza.ingredients = pizza.ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });
      return res.json({response: tools.dto(pizza, "pizzas")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("pizzas.get.id", (res, id) => {
  return models.Pizza.findByIdAndPopulate(id)
    .then((pizza) => {
      pizza.cook = tools.dto(pizza.cook, "users");
      pizza.ingredients = pizza.ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });
      return res.json({response: tools.dto(pizza, "pizzas")});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

Event.on("pizzas.get.custom", (res, query) => {
  return models.Pizza.find(query)
    .then((pizzas) => {
      let results = pizzas.map((pizza) => {
        pizza.cook = tools.dto(pizza.cook, "users");
        pizza.ingredients = pizza.ingredients.map((ingredient) => {
          return tools.dto(ingredient, "ingredients");
        });
        return tools.dto(pizza, "pizzas");
      });
      return res.json({response: results});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

Event.on("pizzas.update", (res, query, req) => {
  let data = req.validated;

  return models.History.create({message: "Update", userId: req.user._id})
    .then((history)=>{
      data.$push = {history : history._id};
      return models.Pizza.update(query, data, {new: true})
    })
    .then((pizza) => {
      return models.Pizza.findByIdAndPopulate(pizza._id);
    })
    .then((pizza) => {
      pizza.cook = tools.dto(pizza.cook, "users");
      pizza.ingredients = pizza.ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });
      return res.json({response: tools.dto(pizza, "pizzas")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("pizzas.remove", (res, query) => {
  return models.Pizza.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});


/**
 * USERS EVENTS
 */

Event.on("users.get", (res) => {
  return models.User.find({})
    .then((users) => {
      let results = users.map((user) => {
        return tools.dto(user, "users");
      });
      return res.json({response: results});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("users.signup", (res, req) => {
  let data = req.validated;
  return models.User.specials.signup(data)
    .then((token) => {
      return res.json({response: token});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("users.signin", (res, req) => {
  let data = req.validated;
  return models.User.specials.signin(data)
    .then((token) => {
      return res.json({response: token});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("users.get.id", (res, id) => {
  return models.User.findByIdAndPopulate(id)
    .then((user) => {
      return res.json({response: tools.dto(user, "users")});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

Event.on("users.get.custom", (res, query) => {
  return models.User.find(query)
    .then((users) => {
      let results = users.map((user) => {
        return tools.dto(user, "users");
      });
      return res.json({response: results});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

Event.on("users.update", (res, query, req) => {
  let data = req.validated;
  return models.User.update(query, data, {new: true})
    .then((data) => {
      return res.json({response: tools.dto(data, "users")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("users.remove", (res, query) => {
  return models.User.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});


/**
 * INGREDIENTS EVENTS
 */

Event.on("ingredients.get", (res) => {
  return models.Ingredient.find({})
    .then((ingredients) => {
      let results = ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });
      return res.json({response: results});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("ingredients.add", (res, req) => {
  let data = req.validated;
  return models.Ingredient.create(data)
    .then((ingredient) => {
      return res.json({response: tools.dto(ingredient, "ingredients")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("ingredients.get.id", (res, id) => {
  return models.Ingredient.findByIdAndPopulate(id)
    .then((ingredient) => {
      return res.json({response: tools.dto(ingredient, "ingredients")});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

Event.on("ingredients.get.custom", (res, query) => {
  return models.Ingredient.find(query)
    .then((ingredients) => {
      let results = ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });
      return res.json({response: results});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

Event.on("ingredients.update", (res, query, req) => {
  let data = req.validated;
  return models.Ingredient.update(query, data, {new: true})
    .then((ingredient) => {
      return res.json({response: tools.dto(ingredient, "ingredients")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

Event.on("ingredients.remove", (res, query) => {
  return models.Ingredient.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});