"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const event = require('../singleton');
const tools = require('../tools');

router.post('/signup', [tools.middlewares.checkObject], (req, res) => {
  event.emit("users.signup", res, req);
});

router.post('/signin', [tools.middlewares.checkObject], (req, res) => {
  event.emit("users.signin", res, req);
});

router.get('/:id', [], (req, res) => {
  event.emit("users.get.id", res, req.params.id);
});

router.put('/:id', [tools.middlewares.verifyToken, tools.middlewares.authorized, tools.middlewares.checkObject], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("users.update", res, query, req);
});

router.get('/', [tools.middlewares.verifyToken], (req, res) => {
  event.emit("users.get", res);
});

router.delete('/:id', [tools.middlewares.verifyToken], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("users.remove", res, query);
});

module.exports = router;