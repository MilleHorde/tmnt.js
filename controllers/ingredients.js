"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const event = require('../singleton');
const tools = require('../tools');

/**
 * @api {post} /ingredients/add Add ingredients
 * @apiName AddIngredient
 * @apiGroup Ingredients
 *
 * @apiParam {String} token token of user
 * @apiParam {String} name name of ingredient
 * @apiParam {Number} weight weight of ingredient
 * @apiParam {Number} priceCts price of ingredient in cts
 *
 * @apiSuccess {Object} ingredient created.
 */
router.post('/add', [tools.middlewares.verifyToken, tools.middlewares.checkObject], (req, res) => {
  event.emit("ingredients.add", res, req);
});

/**
 * @api {get} /ingredients/:id Get one specific ingredient
 * @apiName GetByIdIngredient
 * @apiGroup Ingredients
 *
 * @apiParam {ObjectId} id id of specific ingredient
 *
 * @apiSuccess {Object} ingredient wanted.
 */
router.get('/:id', [], (req, res) => {
  event.emit("ingredients.get.id", res, req.params.id);
});

/**
 * @api {put} /ingredients/:id Update one specific ingredient
 * @apiName UpdateIngredient
 * @apiGroup Ingredients
 *
 * @apiParam {String} token token of user
 * @apiParam {ObjectId} id id of ingredient wanted
 * @apiParam {String} [name] name of ingredient
 * @apiParam {Number} [weight] weight of ingredient
 * @apiParam {Number} [priceCts] price of ingredient in cts
 *
 * @apiSuccess {Object} ingredient updated.
 */
router.put('/:id', [tools.middlewares.verifyToken, tools.middlewares.checkObject], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("ingredients.update", res, query, req);
});

/**
 * @api {get} /ingredients/ Get all ingredients // search/sort in all ingredients
 * @apiName GetAllIngredientsFiltered
 * @apiGroup Ingredients
 *
 * @apiParam {String} [name] name of ingredient
 * @apiParam {Number} [weight] weight of ingredient
 * @apiParam {Number} [priceCts] price of ingredient in cts
 * @apiParam {String} [sort] column to sort
 *
 * @apiSuccess {Array} ingredients. (filtered)
 */
router.get('/', [], (req, res) => {
  if(Object.keys(req.query).length){
    event.emit("ingredients.get.custom", res, req.query);
  }else{
    event.emit("ingredients.get", res);
  }
});

/**
 * @api {delete} /ingredients/:id Delete one specific ingredient
 * @apiName DeleteIngredient
 * @apiGroup Ingredients
 *
 * @apiParam {String} token token of user
 * @apiParam {ObjectId} id id of specific ingredient
 *
 * @apiSuccess {Boolean} response.
 */
router.delete('/:id', [tools.middlewares.verifyToken], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("ingredients.remove", res, query);
});

module.exports = router;
