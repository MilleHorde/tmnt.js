"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const event = require('../singleton');
const tools = require('../tools');

/**
 * @api {post} /pizzas/add Add pizza
 * @apiName AddPizza
 * @apiGroup Pizzas
 *
 * @apiParam {String} token token of user
 * @apiParam {String} name name of pizza
 * @apiParam {Array} ingredients Objectid of ingredients of pizza
 * @apiParam {String} image image of pizza
 * @apiParam {String} description description of pizza
 * @apiParam {Number} priceCts price of ingredient in cts
 *
 * @apiSuccess {Object} ingredient created.
 */
router.post('/add', [tools.middlewares.verifyToken, tools.middlewares.checkObject], (req, res) => {
  event.emit("pizzas.add", res, req);
});

/**
 * @api {get} /pizzas/:id Get one specific pizza
 * @apiName GetPizzaById
 * @apiGroup Pizzas
 *
 * @apiParam {ObjectId} id id of specific pizza
 *
 * @apiSuccess {Object} pizza wanted.
 */
router.get('/:id', [], (req, res) => {
  event.emit("pizzas.get.id", res, req.params.id);
});

/**
 * @api {put} /pizzas/:id Update one specific pizza
 * @apiName UpdatePizza
 * @apiGroup Pizzas
 *
 * @apiParam {ObjectId} id id of ingredient wanted
 * @apiParam {String} token token of user
 * @apiParam {String} [name] name of pizza
 * @apiParam {String} [image] image of pizza
 * @apiParam {Array} [ingredients] objectId of ingredients of pizza
 * @apiParam {String} [description] description of pizza
 * @apiParam {Number} [priceCts] price of pizza in cts
 *
 * @apiSuccess {Object} ingredient updated.
 */
router.put('/:id', [tools.middlewares.verifyToken, tools.middlewares.checkObject], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("pizzas.update", res, query, req);
});

/**
 * @api {get} /pizzas/ Get all pizzas // search/sort in all pizzas
 * @apiName GetAllPizzasFiltered
 * @apiGroup Pizzas
 *
 * @apiParam {String} [name] name of pizzas
 * @apiParam {String} [description] description of pizzas
 * @apiParam {Number} [priceCts] price of pizzas in cts
 * @apiParam {String} [sort] column to sort
 *
 * @apiSuccess {Array} pizzas. (filtered)
 */
router.get('/', [], (req, res) => {
  if(Object.keys(req.query).length){
    event.emit("pizzas.get.custom", res, req.query);
  }else{
    event.emit("pizzas.get", res);
  }
});

/**
 * @api {delete} /pizzas/:id Delete one specific pizza
 * @apiName DeletePizza
 * @apiGroup Pizzas
 *
 * @apiParam {String} token token of user
 * @apiParam {ObjectId} id id of specific pizza
 *
 * @apiSuccess {Boolean} response.
 */
router.delete('/:id', [tools.middlewares.verifyToken], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("pizzas.remove", res, query);
});

module.exports = router;
