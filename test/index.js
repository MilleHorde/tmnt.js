"use strict";

if(process.env.NODE_ENV !== 'test'){
  process.env.NODE_ENV = 'test';
}

describe("### TMNT.js tests ###", ()=>{

  require('../controllers/controllersTest');

});

