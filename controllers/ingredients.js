"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', function(req, res, next) {
  res.render('index', { title: config.title });
});

module.exports = router;
