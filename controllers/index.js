"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const Event = require('../singleton');

router.get('/', function(req, res, next) {
  Event.emit("test");
  res.send({ title: config.title });
});

module.exports = router;
