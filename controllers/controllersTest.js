"use strict";
const models = require('../models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
const tools = require('../tools');

chai.use(chaiHttp);

describe('Routes -- TMNT.js', () => {
  before(() => {
    let self = this;
    self.api = chai.request(server);
  });

  describe('/users', () => {

    describe('/ -- GET tests', () => {
      before(() => {
        let self = this;
        self.user1 = {
          firstName: "test1",
          lastName: "test1",
          email: "test1@test.com",
          password: "Testtest1"
        };
        self.user2 = {
          firstName: "test2",
          lastName: "test2",
          email: "test2@test.com",
          password: "Testtest2"
        };

        return models.User.remove({})
          .then((user) => {
            return models.User.create(self.user1);
          })
          .then((user) => {
            return models.User.create(self.user2);
          })
      });

      it("should return two users", () => {
        let self = this;
        return self.api
          .get('/users')
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            expect(res.body.response.length).to.eql(2);
            res.body.response.forEach((user, index) => {
              index++;
              expect(user.email).to.eql(self["user" + index].email);
              expect(user.lastName).to.eql(self["user" + index].lastName);
              expect(user.firstName).to.eql(self["user" + index].firstName);
            })
          })
      });
    });

    describe('/signup -- POST tests', () => {
      before(() => {
        let self = this;
        self.user1 = {
          firstName: "test1",
          lastName: "test1",
          email: "test1@test.com",
          password: "Testtest1"
        };

        return models.User.remove({});

      });

      it("should create one user and return token", () => {
        let self = this;
        return self.api
          .post('/users/signup')
          .send(self.user1)
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            return tools.verifyJWTAsync(res.body.response);
          })
          .then((decoded) => {
            return models.User.findById(decoded.id);
          })
          .then((user) => {
            expect(user.email).to.eql(self.user1.email);
            expect(user.firstName).to.eql(self.user1.firstName);
            expect(user.lastName).to.eql(self.user1.lastName);
          })
      });

      it("should error if required params are not present", () => {
        let self = this;
        return self.api
          .post('/users/signup')
          .send({})
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                email: self.user1.email
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                email: self.user1.email,
                firstName: self.user1.firstName
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                email: self.user1.email,
                lastName: self.user1.lastName,
                firstName: self.user1.firstName
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                email: self.user1.email,
                lastName: self.user1.lastName,
                password: self.user1.password
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
          })
      });

      it("should error if params haven't good format -- see dto in constants for details", () => {
        let self = this;
        return self.api
          .post('/users/signup')
          .send({firstName: 1})
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                email: "test1.com"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                lastName: 2
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                password: "12222"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signup')
              .send({
                password: 12
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
          })
      });
    });

    describe('/signin -- POST tests', () => {
      before(() => {
        let self = this;
        self.user1 = {
          firstName: "test1",
          lastName: "test1",
          email: "test1@test.com",
          password: "Testtest1"
        };

        return models.User.remove({})
          .then(() => {
            return models.User.specials.signup(self.user1)
          });

      });

      it("should connect one user and return token", () => {
        let self = this;
        return self.api
          .post('/users/signin')
          .send({
            email: self.user1.email,
            password: self.user1.password
          })
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            return tools.verifyJWTAsync(res.body.response);
          })
          .then((decoded) => {
            return models.User.findById(decoded.id);
          })
          .then((user) => {
            expect(user.email).to.eql(self.user1.email);
            expect(user.firstName).to.eql(self.user1.firstName);
            expect(user.lastName).to.eql(self.user1.lastName);
          })
      });

      it("should error if required params are not present", () => {
        let self = this;
        return self.api
          .post('/users/signin')
          .send({})
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signin')
              .send({
                email: self.user1.email
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signin')
              .send({
                password: self.user1.password
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
          })
      });

      it("should error if params haven't good format -- see dto in constants for details", () => {
        let self = this;
        return self.api
          .post('/users/signin')
          .send({email: 1})
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signin')
              .send({
                email: "test1.com"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signin')
              .send({
                password: 2
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signin')
              .send({
                password: "12222"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.post('/users/signin')
              .send({
                password: 12
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
          })
      });
    });

    describe('/:id -- PUT tests', () => {
      before(() => {
        let self = this;
        self.user1 = {
          firstName: "test1",
          lastName: "test1",
          email: "test1@test.com",
          password: "Testtest1"
        };

        return models.User.remove({})
          .then(() => {
            return models.User.specials.signup(self.user1)
          })
          .then((user)=>{
            return self.api.post('/users/signin')
              .send({
                email: self.user1.email,
                password: self.user1.password
              })
          })
          .then((res) => {
            self.user1.token = res.body.response;
            return tools.verifyJWTAsync(res.body.response);
          })
          .then((decoded) => {
            self.user1._id = decoded.id;
          })

      });

      it("should modify user who is passed in param and return user updated", () => {
        let self = this;
        return self.api
          .put('/users/'+self.user1._id)
          .send({
            password: "Azerty123"
          })
          .set('Authorization', self.user1.token)
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            return self.api.post('/users/signin')
              .send({
                email: self.user1.email,
                password: "Azerty123"
              });
          })
          .then((res) => {
            expect(res.status).to.eql(200);
            return self.api
              .put('/users/'+self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                lastName: "toto",
                firstName: "tata",
                email: "toto@tata.com"
              })
          })
          .then((res)=>{
            expect(res.status).to.eql(200);
            expect(res.body.response.email).to.eql("toto@tata.com");
            expect(res.body.response.firstName).to.eql("tata");
            expect(res.body.response.lastName).to.eql("toto");
          })
      });

      it("should error if token is not present", () => {
        let self = this;
        return self.api
          .put('/users/'+self.user1._id)
          .send({
            password: "Azerty123"
          })
          .then((res) => {
            expect(res).to.be.a('null');
          })
          .catch((err) => {
            expect(err.status).to.eql(403);
          })
      });

      it("should error if params haven't good format -- see dto in constants for details", () => {
        let self = this;
        return self.api
          .put('/users/'+self.user1._id)
          .set('Authorization', self.user1.token)
          .send({firstName: 1})
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/'+self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                email: "test1.com"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/'+self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                lastName: 2
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/'+self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                password: "12222"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/'+self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                password: 12
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
          })
      });
    });

    describe('/:id -- GET tests', () => {
      before(() => {
        let self = this;
        self.user1 = {
          firstName: "test1",
          lastName: "test1",
          email: "test1@test.com",
          password: "Testtest1"
        };
        self.user2 = {
          firstName: "test2",
          lastName: "test2",
          email: "test2@test.com",
          password: "Testtest2"
        };

        return models.User.remove({})
          .then(() => {
            return models.User.create(self.user1)
          })
          .then((user) => {
            self.user1._id = user._id;
          })
          .then(() => {
            return models.User.create(self.user2)
          })
          .then((user) => {
            self.user2._id = user._id;
          })

      });

      it("should return one specific users", () => {
        let self = this;
        return self.api
          .get('/users/' + self.user1._id)
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            expect(res.body.response.email).to.eql(self.user1.email);
            expect(res.body.response.lastName).to.eql(self.user1.lastName);
            expect(res.body.response.firstName).to.eql(self.user1.firstName);
          })
      });

      it("should return one specific users and different of second user", () => {
        let self = this;
        return self.api
          .get('/users/' + self.user2._id)
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            expect(res.body.response.email).to.not.eql(self.user1.email);
            expect(res.body.response.lastName).to.not.eql(self.user1.lastName);
            expect(res.body.response.firstName).to.not.eql(self.user1.firstName);
          })
      });

      it("should error if id param doesn't have corresponding documents in mongoDB", () => {
        let self = this;
        return self.api
          .get('/users/' + self.user2._id + 1)
          .then((res) => {
            expect(res).to.be.a('null');
          })
          .catch((err) => {
            expect(err.response.status).to.eql(404);
          })
      });
    });

    describe('/:id -- DELETE tests', () => {
      before(() => {
        let self = this;
        self.user1 = {
          firstName: "test1",
          lastName: "test1",
          email: "test1@test.com",
          password: "Testtest1"
        };

        return models.User.remove({})
          .then(() => {
            return models.User.specials.signup(self.user1)
          })
          .then((user)=>{
            return self.api.post('/users/signin')
              .send({
                email: self.user1.email,
                password: self.user1.password
              })
          })
          .then((res) => {
            self.user1.token = res.body.response;
            return tools.verifyJWTAsync(res.body.response);
          })
          .then((decoded) => {
            self.user1._id = decoded.id;
          })

      });

      it("should remove one specific users", () => {
        let self = this;
        return self.api
          .del('/users/' + self.user1._id)
          .set('Authorization', self.user1.token)
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            expect(res.body.response).to.eql(true);
          })
      });

      it("should error if id param doesn't have corresponding documents in mongoDB", () => {
        let self = this;
        return self.api
          .del('/users/' + self.user1._id+1)
          .set('Authorization', self.user1.token)
          .catch((err) => {
            expect(err.status).to.eql(500);
          })
      });

      it("should error if token is not present", () => {
        let self = this;
        return self.api
          .del('/users/' + self.user1._id)
          .catch((err) => {
            expect(err.status).to.eql(403);
            expect(err.response.body).to.eql({"error": "Token missing"});
          })
      });
    });
  });

});

describe('/ingredients', () => {
  before(() => {
    return models.Ingredient.remove({});
  });

  describe('/ -- GET tests', () => {

  });

  describe('/:id -- PUT tests', () => {

  });

  describe('/:id -- GET tests', () => {

  });

  describe('/:id -- DELETE tests', () => {

  });

});

describe('/pizzas', () => {
  before(() => {
    return models.Pizza.remove({});
  });

  describe('/ -- GET tests', () => {

  });

  describe('/:id -- PUT tests', () => {

  });

  describe('/:id -- GET tests', () => {

  });

  describe('/:id -- DELETE tests', () => {

  });

});
