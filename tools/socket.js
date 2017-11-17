"use strict";
const socket = require('socket.io');
let app = {};
let io = {};

let alertElse = (send, type, eventName) => {
  let toSend = {
    type : type,
    item : send
  };
  io.emit(eventName, toSend);
};

let setApp = (server) => {
  app = server;
  io = socket.listen(app);
  io.origins('*:*');
  io.on('connection', (socket) => {
    console.log(`New Connection on socket server : ${socket.id}`)
  });
};

module.exports = {
  io : io,
  setApp,
  alertElse
};