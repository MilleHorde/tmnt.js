"use strict";
const socket = require('socket.io');
let app = {};
let io = {};

let alertElse = (send, eventName) => {
  io.emit(eventName, send);
};

let setApp = (server) => {
  app = server;
  io = socket.listen(app);
  io.on('connection', (socket) => {
    console.log(`New Connection on socket server : ${socket.id}`)
  });
};

module.exports = {
  io : io,
  setApp,
  alertElse
};