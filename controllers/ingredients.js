"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const event = require('../singleton');
const tools = require('../tools');

router.post('/add', [tools.middlewares.verifyToken, tools.middlewares.checkObject], (req, res) => {
  event.emit("ingredients.add", res, req);
});

router.get('/:id', [], (req, res) => {
  event.emit("ingredients.get.id", res, req.params.id);
});

router.put('/:id', [tools.middlewares.verifyToken, tools.middlewares.checkObject], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("ingredients.update", res, query, req);
});

router.get('/', [], (req, res) => {
  event.emit("ingredients.get", res);
});

router.delete('/:id', [tools.middlewares.verifyToken], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("ingredients.remove", res, query);
});

module.exports = router;
