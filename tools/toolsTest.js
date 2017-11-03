"use strict";
const chai = require('chai');
const server = require('../server');
const expect = chai.expect;
const tools = require('../tools');

describe('Tools --', () => {

  describe('normalizePort tests', () => {
    it("should return port send in param", () => {
      expect(tools.normalizePort(3011)).to.eql(3011);
    });

    it("should return normalize port", () => {
      expect(tools.normalizePort('3000a00')).to.eql(3000);
    });

    it("should return value if NaN", () => {
      expect(tools.normalizePort('azerty')).to.eql("azerty");
    });
  });

  describe('onListening tests', () => {
    it("should return port 3011", () => {
      expect(tools.onListening(server)).to.eql('Listening on port 3011');
    })
  });

  describe('generateToken tests', () => {
    it("should generate token from one id passed in param", () => {
      return tools.generateToken("123")
        .then((results) => {
          expect(results.id).to.eql('123');
          expect(typeof results.token).to.eql('string');
        });
    });

    it("should generate token even if no param passed", () => {
      return tools.generateToken()
        .then((results) => {
          expect(results.id).to.eql();
          expect(typeof results.token).to.eql('string');
        });
    });
  });

  describe('verifyJWTAsync tests', () => {
    it("should check and return id corresponding to token passed in param", ()=> {
      let token = "";
      return tools.generateToken("123")
        .then((results) => {
          token = results.token;
          return tools.verifyJWTAsync(results.token);
        }).then((results) => {
          expect(results.id).to.eql("123");
          expect(results.token).to.eql(token);
          expect(typeof results.token).to.eql('string');
        });
    });

    it("should check and return 'undefined' id corresponding to token passed in param even if original id is 'undefined'", ()=> {
      let token = "";
      return tools.generateToken()
        .then((results) => {
          token = results.token;
          return tools.verifyJWTAsync(results.token);
        })
        .then((results) => {
          expect(results.id).to.eql();
          expect(results.token).to.eql(token);
          expect(typeof results.token).to.eql('string');
        });
    });

    it("should error if no token passed in param", () => {
      return tools.verifyJWTAsync()
        .catch((err)=>{
          expect(err.message).to.eql('jwt must be provided');
        });
    });
  });

});