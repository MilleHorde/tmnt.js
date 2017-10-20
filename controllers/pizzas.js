"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const event = require('../singleton');

router.get('/', function(req, res) {
  event.emit("pizzas.get", res);
});

module.exports = router;
