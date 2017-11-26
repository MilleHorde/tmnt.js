define({ "api": [  {    "type": "get",    "url": "/",    "title": "Home page of API",    "name": "GetTitle",    "group": "Index",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "contain",            "description": "<p>title of API.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/index.js",    "groupTitle": "Index"  },  {    "type": "post",    "url": "/ingredients/add",    "title": "Add ingredients",    "name": "AddIngredient",    "group": "Ingredients",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of ingredient</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "weight",            "description": "<p>weight of ingredient</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "priceCts",            "description": "<p>price of ingredient in cts</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "ingredient",            "description": "<p>created.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/ingredients.js",    "groupTitle": "Ingredients"  },  {    "type": "delete",    "url": "/ingredients/:id",    "title": "Delete one specific ingredient",    "name": "DeleteIngredient",    "group": "Ingredients",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of specific ingredient</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "response.",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/ingredients.js",    "groupTitle": "Ingredients"  },  {    "type": "get",    "url": "/ingredients/",    "title": "Get all ingredients // search/sort in all ingredients",    "name": "GetAllIngredientsFiltered",    "group": "Ingredients",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>name of ingredient</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "weight",            "description": "<p>weight of ingredient</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "priceCts",            "description": "<p>price of ingredient in cts</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "sort",            "description": "<p>column to sort</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "ingredients.",            "description": "<p>(filtered)</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/ingredients.js",    "groupTitle": "Ingredients"  },  {    "type": "get",    "url": "/ingredients/:id",    "title": "Get one specific ingredient",    "name": "GetByIdIngredient",    "group": "Ingredients",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of specific ingredient</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "ingredient",            "description": "<p>wanted.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/ingredients.js",    "groupTitle": "Ingredients"  },  {    "type": "put",    "url": "/ingredients/:id",    "title": "Update one specific ingredient",    "name": "UpdateIngredient",    "group": "Ingredients",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of ingredient wanted</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>name of ingredient</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "weight",            "description": "<p>weight of ingredient</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "priceCts",            "description": "<p>price of ingredient in cts</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "ingredient",            "description": "<p>updated.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/ingredients.js",    "groupTitle": "Ingredients"  },  {    "type": "post",    "url": "/pizzas/add",    "title": "Add pizza",    "name": "AddPizza",    "group": "Pizzas",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of pizza</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": false,            "field": "ingredients",            "description": "<p>Objectid of ingredients of pizza</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "image",            "description": "<p>image of pizza</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "description",            "description": "<p>description of pizza</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": false,            "field": "priceCts",            "description": "<p>price of ingredient in cts</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "ingredient",            "description": "<p>created.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/pizzas.js",    "groupTitle": "Pizzas"  },  {    "type": "delete",    "url": "/pizzas/:id",    "title": "Delete one specific pizza",    "name": "DeletePizza",    "group": "Pizzas",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of specific pizza</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "response.",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/pizzas.js",    "groupTitle": "Pizzas"  },  {    "type": "get",    "url": "/pizzas/",    "title": "Get all pizzas // search/sort in all pizzas",    "name": "GetAllPizzasFiltered",    "group": "Pizzas",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>name of pizzas</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "description",            "description": "<p>description of pizzas</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "priceCts",            "description": "<p>price of pizzas in cts</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "sort",            "description": "<p>column to sort</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "pizzas.",            "description": "<p>(filtered)</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/pizzas.js",    "groupTitle": "Pizzas"  },  {    "type": "get",    "url": "/pizzas/:id",    "title": "Get one specific pizza",    "name": "GetPizzaById",    "group": "Pizzas",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of specific pizza</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "pizza",            "description": "<p>wanted.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/pizzas.js",    "groupTitle": "Pizzas"  },  {    "type": "put",    "url": "/pizzas/:id",    "title": "Update one specific pizza",    "name": "UpdatePizza",    "group": "Pizzas",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of ingredient wanted</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "name",            "description": "<p>name of pizza</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "image",            "description": "<p>image of pizza</p>"          },          {            "group": "Parameter",            "type": "Array",            "optional": true,            "field": "ingredients",            "description": "<p>objectId of ingredients of pizza</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "description",            "description": "<p>description of pizza</p>"          },          {            "group": "Parameter",            "type": "Number",            "optional": true,            "field": "priceCts",            "description": "<p>price of pizza in cts</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "ingredient",            "description": "<p>updated.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/pizzas.js",    "groupTitle": "Pizzas"  },  {    "type": "delete",    "url": "/users/:id",    "title": "Delete one specific user",    "name": "DeleteUser",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of specific user</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "response.",            "description": ""          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/users.js",    "groupTitle": "Users"  },  {    "type": "get",    "url": "/users/",    "title": "Get All Users",    "name": "GetAllUsers",    "group": "Users",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Array",            "optional": false,            "field": "all",            "description": "<p>users.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/users.js",    "groupTitle": "Users"  },  {    "type": "get",    "url": "/users/me",    "title": "Get user corresponding to token passed",    "name": "GetMe",    "group": "Users",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "User",            "optional": false,            "field": "Token",            "description": "<p>'s user.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/users.js",    "groupTitle": "Users"  },  {    "type": "get",    "url": "/users/:id",    "title": "Get one specific user",    "name": "GetUserById",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of user wanted</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "user",            "description": "<p>wanted.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/users.js",    "groupTitle": "Users"  },  {    "type": "post",    "url": "/users/signin",    "title": "Log in an user",    "name": "SignIn",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>email of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>password of user</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "user",            "description": "<p>token logged.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/users.js",    "groupTitle": "Users"  },  {    "type": "post",    "url": "/users/signup",    "title": "Create new user",    "name": "SignUp",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "lastname",            "description": "<p>lastname of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "firstname",            "description": "<p>firstname of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>email of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>password of user</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "user",            "description": "<p>token created.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/users.js",    "groupTitle": "Users"  },  {    "type": "put",    "url": "/users/:id",    "title": "Update specific user",    "name": "UpdateUserById",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          },          {            "group": "Parameter",            "type": "ObjectId",            "optional": false,            "field": "id",            "description": "<p>id of user wanted</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "lastname",            "description": "<p>lastname of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "firstname",            "description": "<p>firstname of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "email",            "description": "<p>email of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": true,            "field": "password",            "description": "<p>password of user</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "user",            "description": "<p>updated.</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "controllers/users.js",    "groupTitle": "Users"  }] });
