"use strict";
const express = require('express');
const router = express.Router();
const config = require('../config');
const event = require('../singleton');
const tools = require('../tools');

/**
 * @api {post} /users/signup Create new user
 * @apiName SignUp
 * @apiGroup Users
 *
 * @apiParam {String} lastname lastname of user
 * @apiParam {String} firstname firstname of user
 * @apiParam {String} email email of user
 * @apiParam {String} password password of user
 *
 * @apiSuccess {String} user token created.
 */
router.post('/signup', [tools.middlewares.checkObject], (req, res) => {
  event.emit("users.signup", res, req);
});

/**
 * @api {post} /users/signin Log in an user
 * @apiName SignIn
 * @apiGroup Users
 *
 * @apiParam {String} email email of user
 * @apiParam {String} password password of user
 *
 * @apiSuccess {String} user token logged.
 */
router.post('/signin', [tools.middlewares.checkObject], (req, res) => {
  event.emit("users.signin", res, req);
});

/**
 * @api {get} /users/me Get user corresponding to token passed
 * @apiName GetMe
 * @apiGroup Users
 *
 * @apiSuccess {User} Token's user.
 */
router.get('/me', [tools.middlewares.verifyToken], (req, res) => {

  res.json({response: req.user});
});

/**
 * @api {get} /users/:id Get one specific user
 * @apiName GetUserById
 * @apiGroup Users
 *
 * @apiParam {ObjectId} id id of user wanted
 *
 * @apiSuccess {Object} user wanted.
 */
router.get('/:id', [], (req, res) => {
  event.emit("users.get.id", res, req.params.id);
});

/**
 * @api {put} /users/:id Update specific user
 * @apiName UpdateUserById
 * @apiGroup Users
 *
 * @apiParam {String} token token of user
 * @apiParam {ObjectId} id id of user wanted
 * @apiParam {String} [lastname] lastname of user
 * @apiParam {String} [firstname] firstname of user
 * @apiParam {String} [email] email of user
 * @apiParam {String} [password] password of user
 *
 * @apiSuccess {Object} user updated.
 */
router.put('/:id', [tools.middlewares.verifyToken, tools.middlewares.authorized, tools.middlewares.checkObject], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("users.update", res, query, req);
});

/**
 * @api {get} /users/ Get All Users
 * @apiName GetAllUsers
 * @apiGroup Users
 *
 * @apiSuccess {Array} all users.
 */
router.get('/', [], (req, res) => {
  event.emit("users.get", res);
});

/**
 * @api {delete} /users/:id Delete one specific user
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiParam {String} token token of user
 * @apiParam {ObjectId} id id of specific user
 *
 * @apiSuccess {Boolean} response.
 */
router.delete('/:id', [tools.middlewares.verifyToken], (req, res) => {
  let query = {_id: req.params.id};
  event.emit("users.remove", res, query);
});

module.exports = router;