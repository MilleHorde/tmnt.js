"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const event = require('../singleton');

router.post('/add', [], (req, res) => {
  req.validated = req.body;
  event.emit("ingredients.add", res, req.validated);
});

router.get('/:id', [], (req, res) => {
  event.emit("ingredients.get.id", res, req.params.id);
});

router.put('/:id', [], (req, res) => {
  let query = {_id: req.params.id};
  req.validated = req.body;
  event.emit("ingredients.update", res, query, req.validated);
});

router.get('/', [], (req, res) => {
  event.emit("ingredients.get", res);
});

module.exports = router;
