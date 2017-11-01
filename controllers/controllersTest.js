"use strict";
const models = require('../models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('TMNT.js', () => {
  before(() => {
    let self = this;
    self.api = chai.request(server);
  });

  it("should test", () => {
    let self = this;
    return self.api
      .get('/pizzas')
      .then((res)=>{
          expect(res.statusCode).to.eql(200);
      })
  });
});