"use strict";
if(process.env.NODE_ENV !== 'test'){
  process.env.NODE_ENV = 'test';
}

require('../controllers/controllersTest');