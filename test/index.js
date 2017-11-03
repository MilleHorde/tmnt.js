"use strict";

if(process.env.NODE_ENV !== 'test'){
  process.env.NODE_ENV = 'test';
}

describe("### TMNT.js tests ###", ()=>{

  // tests about controllers/routes
  require('../controllers/controllersTest');

  // tests about tools
  require('../tools/toolsTest');

});