"use strict";
const Event = require('../singleton');
const models = require('../models');
const tools = require('../tools');
const constants = require('../constants');

// PIZZAS EVENTS
// ----------------

//GET Pizzas
// ----------------

//With this event the request that call this event will be terminated with response
//that contains all pizzas find in Database
Event.on("pizzas.get", (res) => {
  //Get all pizzas and populate all field that need population
  return models.Pizza.findAndPopulate({})
    .then((pizzas) => {
    //select field to return to client with dto function
      let results = pizzas.map((pizza) => {
        if (pizza.cook) {
          pizza.cook = tools.dto(pizza.cook, "users");
        }
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

//POST Add pizza
// ----------------

//This event add pizza with params received in request into database
//Return the new pizza to response
Event.on("pizzas.add", (res, req) => {
  let data = req.validated;
  data.cook = req.user._id;
  data.history = [];
  //Create history for insert of pizza
  return models.History.create({message: "Insert", userId: req.user._id})
    .then((history) => {
      data.history.push(history._id);
      //Push id of history in pizza creation
      return models.Pizza.create(data);
    })
    .then((pizza) => {
      return models.Pizza.findByIdAndPopulate(pizza._id);
    })
    .then((pizza) => {
      //select fields to return in response with dto function
      if (pizza.cook) {
        pizza.cook = tools.dto(pizza.cook, "users");
      }
      pizza.ingredients = pizza.ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });

      //emit to all clients that a new pizza have been created
      tools.socket.alertElse(pizza, "add", "pizza");

      return res.json({response: tools.dto(pizza, "pizzas")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//GET Pizza by id
// ----------------

//get one specific pizza with id passed in param
Event.on("pizzas.get.id", (res, id) => {
  //get pizza and populate fields
  return models.Pizza.findByIdAndPopulate(id)
    .then((pizza) => {
      //select fields to return to client
      if (pizza.cook) {
        pizza.cook = tools.dto(pizza.cook, "users");
      }
      pizza.ingredients = pizza.ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });
      return res.json({response: tools.dto(pizza, "pizzas")});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

//GET filtered pizzas
// ----------------

//With this event, you can filter response with query
Event.on("pizzas.get.custom", (res, query) => {
  let options = {};
  let search = {};
  //Check if sort property in query
  //If present, add options to sort results depends of variable set in sort
  ['sort'].forEach((option) => {
    if(query[option]){
      options[option] = {};
      //sort ascendant or descendant
      if(query[option].includes('-')){
        options[option][query[option].replace("-","")] = -1;
      }else{
        options[option][query[option]] = 1;
      }
    }
  });
  //Check all regex variable with field name identifier
  Object.keys(constants.config.pizzas).forEach((param) => {
    if(query[param]){
      if(constants.config.pizzas[param].type === "string"){
        search[param] = {$regex:query[param], $options:"i"};
      }else{
        search[param] = query[param];
      }
    }
  });
  //find pizzas with corresponding parameters
  return models.Pizza.find(search, options)
    .then((pizzas) => {
      let results = pizzas.map((pizza) => {
        //Use dto to prettify fields to return
        if (pizza.cook) {
          pizza.cook = tools.dto(pizza.cook, "users");
        }
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

//PUT Pizza update
// ----------------

//Event to update pizza with query param and req that contains updated fields
Event.on("pizzas.update", (res, query, req) => {
  let data = req.validated;
  //Update history with add history

  return models.History.create({message: "Update", userId: req.user._id})
    .then((history) => {
      data.$push = {history: history._id};
      return models.Pizza.update(query, data, {new: true})
    })
    .then((pizza) => {
    //find updated pizza and populate
      return models.Pizza.findByIdAndPopulate(pizza._id);
    })
    .then((pizza) => {
    //Use dto fucntion to set fields to return
      if (pizza.cook) {
        pizza.cook = tools.dto(pizza.cook, "users");
      }
      pizza.ingredients = pizza.ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });

      //Emit to all client that pizza have been updated
      tools.socket.alertElse(pizza, "update", "pizza");

      return res.json({response: tools.dto(pizza, "pizzas")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//REMOVE Pizza by Id
// ----------------

//This event remove one pizza with query to find specific pizza
Event.on("pizzas.remove", (res, query) => {
  return models.Pizza.remove(query)
    .then(() => {
      tools.socket.alertElse(query._id, "remove", "pizza");

      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});


//USERS EVENTS
// ----------------

//GET Users
// ----------------

//Return all users present in database
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

//POST User signup
// ----------------

//Create an user with all param passed in req
Event.on("users.signup", (res, req) => {
  //With middlewares all param have been validated
  let data = req.validated;
  return models.User.specials.signup(data)
    .then((token) => {
    //return token of user
      return res.json({response: token});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//POST User signin
// ----------------

//Log in an user with email and password passed in param
Event.on("users.signin", (res, req) => {
  //With middlewares all param have been validated
  let data = req.validated;
  return models.User.specials.signin(data)
    .then((token) => {
    //return token of user
      return res.json({response: token});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//GET User by id
// ----------------

//This event return one user with id passed in param
Event.on("users.get.id", (res, id) => {
  //Find and populate user with id
  return models.User.findByIdAndPopulate(id)
    .then((user) => {
      return res.json({response: tools.dto(user, "users")});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

//PUT User update
// ----------------

//This event update user with query to find user and req to access to new value of field
Event.on("users.update", (res, query, req) => {
  //validated value of updated field => with middlewares
  let data = req.validated;
  return models.User.update(query, data, {new: true})
    .then((data) => {
      return res.json({response: tools.dto(data, "users")});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//DELETE User remove
// ----------------

//This event remove user found with query param and response true if delete successful
Event.on("users.remove", (res, query) => {
  return models.User.remove(query)
    .then(() => {
      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});


//INGREDIENTS EVENTS
// ----------------

//GET Ingredients
// ----------------

//Return all ingredients present in database
Event.on("ingredients.get", (res) => {
  return models.Ingredient.find({})
    .then((ingredients) => {
    //Use dto function to select field to return
      let results = ingredients.map((ingredient) => {
        return tools.dto(ingredient, "ingredients");
      });
      return res.json({response: results});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//POST Add Ingredient
// ----------------

//This event add ingredient in database
Event.on("ingredients.add", (res, req) => {
  //data validated with middlewares
  let data = req.validated;
  return models.Ingredient.create(data)
    .then((ingredient) => {
    //Use dto function to return field authorized
      let ingredientFiltered = tools.dto(ingredient, "ingredients");
      //emit all client that new ingredient have been added
      tools.socket.alertElse(ingredientFiltered, "add", "ingredient");

      return res.json({response: ingredientFiltered});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//GET ingredient by id
// ----------------

//This event return one specific ingredient by id passed in param
Event.on("ingredients.get.id", (res, id) => {
  //Find ingredient and populate
  return models.Ingredient.findByIdAndPopulate(id)
    .then((ingredient) => {
      return res.json({response: tools.dto(ingredient, "ingredients")});
    })
    .catch((err) => {
      return res.status(404).json({"Error": "Not Found"})
    })
});

//GET ingredients filtered
// ----------------

//This event return ingredients corresponding to query param and filter param
Event.on("ingredients.get.custom", (res, query) => {
  let options = {};
  let search = {};
  //Check if sort property in query
  //If present, add options to sort results depends of variable set in sort
  ['sort'].forEach((option) => {
    if(query[option]){
      options[option] = {};
      //sort ascendant and descendant
      if(query[option].includes('-')){
        options[option][query[option].replace("-","")] = -1;
      }else{
        options[option][query[option]] = 1;
      }
    }
  });
  //Check all regex variable with field name identifier
  Object.keys(constants.config.ingredients).forEach((param) => {
    if(query[param]){
      if(constants.config.ingredients[param].type === "string"){
        search[param] = {$regex:query[param], $options:"i"};
      }else{
        search[param] = query[param];
      }
    }
  });
  //Find ingredients with filtered parameters
  return models.Ingredient.find(search, options)
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

//PUT ingredient update
// ----------------

//This event manage update of ingredients with query params and param to updated contains in req
Event.on("ingredients.update", (res, query, req) => {
  //data validated with middlewares
  let data = req.validated;
  return models.Ingredient.update(query, data, {new: true})
    .then((ingredient) => {
      //Use dto function to return accepted field
      let ingredientFiltered = tools.dto(ingredient, "ingredients");

      //emit to all clients that ingredient have been updated
      tools.socket.alertElse(ingredientFiltered, "update", "ingredient");

      return res.json({response: ingredientFiltered});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});

//DELETE ingredient remove
// ----------------

//This event remove ingredient with query to find ingredient
Event.on("ingredients.remove", (res, query) => {
  return models.Ingredient.remove(query)
    .then(() => {
      //emit to all client the remove
      tools.socket.alertElse(query._id, "remove", "ingredient");

      return res.json({response: true});
    })
    .catch((err) => {
      return res.status(500).json({"Error": err.message || err})
    })
});