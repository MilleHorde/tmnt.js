"use strict";
const models = require('../models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
const tools = require('../tools');

chai.use(chaiHttp);

describe('Routes --', () => {
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

        return Promise.all([
          models.Pizza.remove({}),
          models.User.remove({}),
          models.Ingredient.remove({})
        ])
          .then(() => {
            return models.User.create(self.user1);
          })
          .then((user) => {
            return models.User.create(self.user2);
          })
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
          })
      });

      it("should return empty array if no users", () => {
        let self = this;
        return models.User.remove({})
          .then(() => {
            return self.api
              .get('/users')
          })
          .then((res) => {
            expect(res.statusCode).to.eql(200);
            expect(res.body.response.length).to.eql(0);
          })
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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

        return Promise.all([
          models.Pizza.remove({}),
          models.User.remove({}),
          models.Ingredient.remove({})
        ])

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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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

        return Promise.all([
          models.Pizza.remove({}),
          models.User.remove({}),
          models.Ingredient.remove({})
        ])
          .then(() => {
            return models.User.specials.signup(self.user1)
          })
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
          })
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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

        return Promise.all([
          models.Pizza.remove({}),
          models.User.remove({}),
          models.Ingredient.remove({})
        ])
          .then(() => {
            return models.User.specials.signup(self.user1)
          })
          .then((user) => {
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
          })
      });

      it("should modify user who is passed in param and return user updated", () => {
        let self = this;
        return self.api
          .put('/users/' + self.user1._id)
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
              .put('/users/' + self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                lastName: "toto",
                firstName: "tata",
                email: "toto@tata.com"
              })
          })
          .then((res) => {
            expect(res.status).to.eql(200);
            expect(res.body.response.email).to.eql("toto@tata.com");
            expect(res.body.response.firstName).to.eql("tata");
            expect(res.body.response.lastName).to.eql("toto");
          })
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
          })
      });

      it("should error if token is not present", () => {
        let self = this;
        return self.api
          .put('/users/' + self.user1._id)
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
          .put('/users/' + self.user1._id)
          .set('Authorization', self.user1.token)
          .send({firstName: 1})
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/' + self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                email: "test1.com"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/' + self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                lastName: 2
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/' + self.user1._id)
              .set('Authorization', self.user1.token)
              .send({
                password: "12222"
              })
          })
          .catch((err) => {
            expect(err.status).to.eql(500);
            return self.api.put('/users/' + self.user1._id)
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

        return Promise.all([
          models.Pizza.remove({}),
          models.User.remove({}),
          models.Ingredient.remove({})
        ])
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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

        return Promise.all([
          models.Pizza.remove({}),
          models.User.remove({}),
          models.Ingredient.remove({})
        ])
          .then(() => {
            return models.User.specials.signup(self.user1)
          })
          .then((user) => {
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
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
          .catch((err) => {
            throw (err.response) ? Error(err.response.body.Error) : err;
          })
      });

      it("should error if id param doesn't have corresponding documents in mongoDB", () => {
        let self = this;
        return self.api
          .del('/users/' + self.user1._id + 1)
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
    return Promise.all([
      models.Pizza.remove({}),
      models.User.remove({}),
      models.Ingredient.remove({})
    ])
      .catch((err) => {
        throw (err.response) ? Error(err.response.body.Error) : err;
      })
  });

  describe('/ -- GET tests', () => {
    before(() => {
      let self = this;
      self.ingredient1 = {
        name: "ingredient1",
        weight: 200,
        priceCts: 200
      };
      self.ingredient2 = {
        name: "ingredient2",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])
        .then(() => {
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          return models.Ingredient.create(self.ingredient2);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return two ingredients", () => {
      let self = this;
      return self.api
        .get('/ingredients')
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.length).to.eql(2);
          res.body.response.forEach((ingredient, index) => {
            index++;
            expect(ingredient.name).to.eql(self["ingredient" + index].name);
            expect(ingredient.weight).to.eql(self["ingredient" + index].weight);
            expect(ingredient.priceCts).to.eql(self["ingredient" + index].priceCts);
          })
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return empty array if no ingredients", () => {
      let self = this;
      return models.Ingredient.remove({})
        .then(() => {
          return self.api
            .get('/ingredients')
        })
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.length).to.eql(0);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

  });

  describe('/ -- POST tests', () => {
    before(() => {
      let self = this;
      self.user1 = {
        firstName: "test1",
        lastName: "test1",
        email: "test1@test.com",
        password: "Testtest1"
      };
      self.ingredient1 = {
        name: "ingredient1",
        weight: 150,
        priceCts: 150
      };
      self.ingredient2 = {
        name: "ingredient2",
        weight: 180,
        priceCts: 180
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])

        .then(() => {
          return models.User.specials.signup(self.user1)
        })
        .then((token) => {
          return tools.verifyJWTAsync(token);
        })
        .then((decoded) => {
          self.user1._id = decoded.id;
          return self.api.post('/users/signin')
            .send({
              email: self.user1.email,
              password: self.user1.password
            })
        })
        .then((res) => {
          self.user1.token = res.body.response;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should create one ingredient and return pizza created", () => {
      let self = this;
      return self.api
        .post('/ingredients/add')
        .send(self.ingredient1)
        .set('Authorization', self.user1.token)
        .then((res) => {
          let ingredient = res.body.response;
          expect(res.statusCode).to.eql(200);
          expect(ingredient.name).to.eql(self.ingredient1.name);
          expect(ingredient.weight).to.eql(self.ingredient1.weight);
          expect(ingredient.priceCts).to.eql(self.ingredient1.priceCts);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if required params are not present", () => {
      let self = this;
      return self.api
        .post('/ingredients/add')
        .set('Authorization', self.user1.token)
        .send({})
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/ingredients/add')
            .set('Authorization', self.user1.token)
            .send({
              name: self.ingredient1.name
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/ingredients/add')
            .set('Authorization', self.user1.token)
            .send({
              weight: self.ingredient1.weight,
              priceCts: self.ingredient1.priceCts
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
        })
    });

    it("should error if params haven't good format -- see dto in constants for details", () => {
      let self = this;
      return self.api
        .post('/ingredients/add')
        .set('Authorization', self.user1.token)
        .send({})
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/ingredients/add')
            .set('Authorization', self.user1.token)
            .send({
              name: 1
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/ingredients/add')
            .set('Authorization', self.user1.token)
            .send({
              priceCts: "tete"
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/ingredients/add')
            .set('Authorization', self.user1.token)
            .send({
              weight: "tete"
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
      self.ingredient1 = {
        name: "ingredient1",
        weight: 200,
        priceCts: 200
      };
      self.ingredient2 = {
        name: "ingredient2",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])
        .then(() => {
          return models.User.specials.signup(self.user1)
        })
        .then((user) => {
          self.user1._id = user._id;
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          self.ingredient1._id = ingredient._id;
          return models.Ingredient.create(self.ingredient2);
        })
        .then((ingredient) => {
          self.ingredient2._id = ingredient._id;
          return self.api.post('/users/signin')
            .send({
              email: self.user1.email,
              password: self.user1.password
            })
        })
        .then((res) => {
          self.user1.token = res.body.response;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should modify user who is passed in param and return user updated", () => {
      let self = this;
      return self.api
        .put('/ingredients/' + self.ingredient1._id)
        .send({
          name: self.ingredient1.name + " test",
          weight: self.ingredient1.weight + 1,
          priceCts: self.ingredient1.priceCts + 1
        })
        .set('Authorization', self.user1.token)
        .then((res) => {
          expect(res.status).to.eql(200);
          expect(res.body.response.name).to.eql(self.ingredient1.name + " test");
          expect(res.body.response.weight).to.eql(self.ingredient1.weight + 1);
          expect(res.body.response.priceCts).to.eql(self.ingredient1.priceCts + 1);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if token is not present", () => {
      let self = this;
      return self.api
        .put('/ingredients/' + self.ingredient1._id)
        .send({
          name: self.ingredient1.name + " test",
          weight: self.ingredient1.weight + 1,
          priceCts: self.ingredient1.priceCts + 1
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
        .put('/ingredients/' + self.ingredient1._id)
        .set('Authorization', self.user1.token)
        .send({name: 1})
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.put('/ingredients/' + self.ingredient1._id)
            .set('Authorization', self.user1.token)
            .send({
              priceCts: "tete"
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.put('/ingredients/' + self.ingredient1._id)
            .set('Authorization', self.user1.token)
            .send({
              weight: "tete"
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
      self.ingredient1 = {
        name: "ingredient1",
        weight: 200,
        priceCts: 200
      };
      self.ingredient2 = {
        name: "ingredient2",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])
        .then(() => {
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          self.ingredient1._id = ingredient._id;
          return models.Ingredient.create(self.ingredient2);
        })
        .then((ingredient) => {
          self.ingredient2._id = ingredient._id;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return one specific ingredients", () => {
      let self = this;
      return self.api
        .get('/ingredients/' + self.ingredient1._id)
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.name).to.eql(self.ingredient1.name);
          expect(res.body.response.weight).to.eql(self.ingredient1.weight);
          expect(res.body.response.priceCts).to.eql(self.ingredient1.priceCts);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return one specific ingredients and different of second ingredients", () => {
      let self = this;
      return self.api
        .get('/ingredients/' + self.ingredient2._id)
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.name).to.not.eql(self.ingredient1.name);
          expect(res.body.response.weight).to.not.eql(self.ingredient1.weight);
          expect(res.body.response.priceCts).to.not.eql(self.ingredient1.priceCts);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if id param doesn't have corresponding documents in mongoDB", () => {
      let self = this;
      return self.api
        .get('/ingredients/' + self.ingredient1._id + 1)
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
      self.ingredient1 = {
        name: "ingredient1",
        weight: 200,
        priceCts: 200
      };
      self.ingredient2 = {
        name: "ingredient2",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])
        .then(() => {
          return models.User.specials.signup(self.user1)
        })
        .then((user) => {
          self.user1._id = user._id;
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          self.ingredient1._id = ingredient._id;
          return models.Ingredient.create(self.ingredient2);
        })
        .then((ingredient) => {
          self.ingredient2._id = ingredient._id;
          return self.api.post('/users/signin')
            .send({
              email: self.user1.email,
              password: self.user1.password
            })
        })
        .then((res) => {
          self.user1.token = res.body.response;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should remove one specific ingredient", () => {
      let self = this;
      return self.api
        .del('/ingredients/' + self.ingredient1._id)
        .set('Authorization', self.user1.token)
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response).to.eql(true);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if id param doesn't have corresponding documents in mongoDB", () => {
      let self = this;
      return self.api
        .del('/ingredients/' + self.ingredient1._id + 1)
        .set('Authorization', self.user1.token)
        .catch((err) => {
          expect(err.status).to.eql(500);
        })
    });

    it("should error if token is not present", () => {
      let self = this;
      return self.api
        .del('/ingredients/' + self.ingredient1._id)
        .catch((err) => {
          expect(err.status).to.eql(403);
          expect(err.response.body).to.eql({"error": "Token missing"});
        })
    });
  });

});

describe('/pizzas', () => {
  before(() => {
    return Promise.all([
      models.Pizza.remove({}),
      models.User.remove({}),
      models.Ingredient.remove({})
    ])
      .catch((err) => {
        throw (err.response) ? Error(err.response.body.Error) : err;
      })
  });

  describe('/ -- GET tests', () => {
    before(() => {
      let self = this;
      self.user1 = {
        firstName: "test1",
        lastName: "test1",
        email: "test1@test.com",
        password: "Testtest1"
      };
      self.pizza1 = {
        name: "pizza1",
        image: "",
        ingredients: [],
        description: "lorem ipsum",
        priceCts: 200
      };
      self.pizza2 = {
        name: "pizza2",
        image: "",
        ingredients: [],
        description: "lorem ipsum",
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])
        .then(() => {
          return models.User.create(self.user1)
        })
        .then((user) => {
          self.user1._id = user._id;
          self.pizza1.cook = self.user1._id;
          return models.Pizza.create(self.pizza1);
        })
        .then((ingredient) => {
          self.pizza2.cook = self.user1._id;
          return models.Pizza.create(self.pizza2);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return two pizzas", () => {
      let self = this;
      return self.api
        .get('/pizzas')
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.length).to.eql(2);
          res.body.response.forEach((pizza, index) => {
            index++;
            expect(pizza.name).to.eql(self["pizza" + index].name);
            expect(pizza.cook._id.toString()).to.eql(self["pizza" + index].cook.toString());
            expect(pizza.description).to.eql(self["pizza" + index].description);
            expect(pizza.priceCts).to.eql(self["pizza" + index].priceCts);
          })
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return empty array if no pizzas", () => {
      let self = this;
      return models.Pizza.remove({})
        .then(() => {
          return self.api
            .get('/pizzas')
        })
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.length).to.eql(0);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });
  });

  describe('/ -- POST tests', () => {
    before(() => {
      let self = this;
      self.user1 = {
        firstName: "test1",
        lastName: "test1",
        email: "test1@test.com",
        password: "Testtest1"
      };
      self.pizza1 = {
        name: "pizza1",
        image: "123",
        description: "lorem ipsum1",
        priceCts: 200
      };
      self.pizza2 = {
        name: "pizza2",
        image: "123",
        description: "lorem ipsum2",
        priceCts: 150
      };
      self.ingredient1 = {
        name: "ingredient1",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])

        .then(() => {
          return models.User.specials.signup(self.user1)
        })
        .then((token) => {
          return tools.verifyJWTAsync(token);
        })
        .then((decoded) => {
          self.user1._id = decoded.id;
          self.pizza1.cook = decoded.id;
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          self.pizza1.ingredients = [ingredient._id];
          self.pizza2.ingredients = [ingredient._id];
          self.pizza2.cook = self.user1._id;
          return self.api.post('/users/signin')
            .send({
              email: self.user1.email,
              password: self.user1.password
            })
        })
        .then((res) => {
          self.user1.token = res.body.response;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should create one pizza and return pizza created", () => {
      let self = this;
      return self.api
        .post('/pizzas/add')
        .send(self.pizza1)
        .set('Authorization', self.user1.token)
        .then((res) => {
          let pizza = res.body.response;
          expect(res.statusCode).to.eql(200);
          expect(pizza.name).to.eql(self.pizza1.name);
          expect(pizza.image).to.eql(self.pizza1.image);
          expect(pizza.description).to.eql(self.pizza1.description);
          expect(pizza.ingredients.length).to.eql(self.pizza1.ingredients.length);
          expect(pizza.cook._id.toString()).to.eql(self.pizza1.cook);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if required params are not present", () => {
      let self = this;
      return self.api
        .post('/pizzas/add')
        .set('Authorization', self.user1.token)
        .send({})
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/pizzas/add')
            .set('Authorization', self.user1.token)
            .send({
              name: self.pizza1.name
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/pizzas/add')
            .set('Authorization', self.user1.token)
            .send({
              description: self.pizza1.description,
              image: self.pizza1.image
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/pizzas/add')
            .set('Authorization', self.user1.token)
            .send({
              ingredients: self.pizza1.ingredients,
              description: self.pizza1.description,
              image: self.pizza1.image
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
        })
    });

    it("should error if params haven't good format -- see dto in constants for details", () => {
      let self = this;
      return self.api
        .post('/pizzas/add')
        .set('Authorization', self.user1.token)
        .send({})
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/pizzas/add')
            .set('Authorization', self.user1.token)
            .send({
              name: 1
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/pizzas/add')
            .set('Authorization', self.user1.token)
            .send({
              description: 1,
              image: 1
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.post('/pizzas/add')
            .set('Authorization', self.user1.token)
            .send({
              ingredients: 1,
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lobortis est gravida lorem posuere lobortis. Sed pulvinar, orci sed vulputate elementum, justo sem vehicula arcu, a mattis est arcu non nulla. Nullam at ipsum luctus, tempus velit non, luctus sapien. Donec porttitor dui eu consequat viverra. Donec est ipsum, interdum sed tristique in, aliquam ut dui. Nunc eget odio at felis semper dignissim quis nec est. Aenean congue, ante sit amet feugiat ultricies, risus leo luctus turpis amet.",
              priceCts: self.pizza1.name
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
      self.pizza1 = {
        name: "pizza1",
        image: "",
        description: "lorem ipsum1",
        priceCts: 200
      };
      self.pizza2 = {
        name: "pizza2",
        image: "",
        description: "lorem ipsum2",
        priceCts: 150
      };
      self.ingredient1 = {
        name: "ingredient1",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])

        .then(() => {
          return models.User.specials.signup(self.user1)
        })
        .then((user) => {
          self.user1._id = user._id;
          self.pizza1.cook = self.user1._id;
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          self.pizza1.ingredients = [ingredient._id];
          self.pizza2.ingredients = [ingredient._id];
          return models.Pizza.create(self.pizza1);
        })
        .then((pizza) => {
          self.pizza2.cook = self.user1._id;
          self.pizza1._id = pizza._id;
          return models.Pizza.create(self.pizza2);
        })
        .then((pizza) => {
          self.pizza2._id = pizza._id;
          return self.api.post('/users/signin')
            .send({
              email: self.user1.email,
              password: self.user1.password
            })
        })
        .then((res) => {
          self.user1.token = res.body.response;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should modify pizza who is passed in param and return user updated", () => {
      let self = this;
      return self.api
        .put('/pizzas/' + self.pizza1._id)
        .set('Authorization', self.user1.token)
        .send({
          name: "toto"
        })
        .set('Authorization', self.user1.token)
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.name).to.eql("toto");
          return self.api
            .put('/pizzas/' + self.pizza1._id)
            .set('Authorization', self.user1.token)
            .send({
              priceCts: 1230
            })
        })
        .then((res) => {
          expect(res.status).to.eql(200);
          expect(res.body.response.priceCts).to.eql(1230);
          return self.api
            .put('/pizzas/' + self.pizza1._id)
            .set('Authorization', self.user1.token)
            .send({
              description: "toto",
              image: "tata"
            })
        })
        .then((res) => {
          expect(res.status).to.eql(200);
          expect(res.body.response.description).to.eql("toto");
          expect(res.body.response.image).to.eql("tata");
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if token is not present", () => {
      let self = this;
      return self.api
        .put('/pizzas/' + self.pizza1._id)
        .send({
          name: "toto"
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
        .put('/pizzas/' + self.pizza1._id)
        .set('Authorization', self.user1.token)
        .send({name: 1})
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.put('/pizzas/' + self.pizza1._id)
            .set('Authorization', self.user1.token)
            .send({
              priceCts: "test1.com"
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.put('/pizzas/' + self.pizza1._id)
            .set('Authorization', self.user1.token)
            .send({
              ingredients: "fzefez"
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.put('/pizzas/' + self.pizza1._id)
            .set('Authorization', self.user1.token)
            .send({
              description: []
            })
        })
        .catch((err) => {
          expect(err.status).to.eql(500);
          return self.api.put('/pizzas/' + self.pizza1._id)
            .set('Authorization', self.user1.token)
            .send({
              image: 12
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
      self.pizza1 = {
        name: "pizza1",
        image: "",
        description: "lorem ipsum1",
        priceCts: 200
      };
      self.pizza2 = {
        name: "pizza2",
        image: "",
        description: "lorem ipsum2",
        priceCts: 150
      };
      self.ingredient1 = {
        name: "ingredient1",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])

        .then(() => {
          return models.User.specials.signup(self.user1)
        })
        .then((user) => {
          self.user1._id = user._id;
          self.pizza1.cook = self.user1._id;
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          self.pizza1.ingredients = [ingredient._id];
          self.pizza2.ingredients = [ingredient._id];
          return models.Pizza.create(self.pizza1);
        })
        .then((pizza) => {
          self.pizza2.cook = self.user1._id;
          self.pizza1._id = pizza._id;
          return models.Pizza.create(self.pizza2);
        })
        .then((pizza) => {
          self.pizza2._id = pizza._id;
          return self.api.post('/users/signin')
            .send({
              email: self.user1.email,
              password: self.user1.password
            })
        })
        .then((res) => {
          self.user1.token = res.body.response;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return one specific pizza", () => {
      let self = this;
      return self.api
        .get('/pizzas/' + self.pizza1._id)
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.name).to.eql(self.pizza1.name);
          expect(res.body.response.description).to.eql(self.pizza1.description);
          expect(res.body.response.priceCts).to.eql(self.pizza1.priceCts);
          expect(res.body.response.ingredients[0]._id.toString()).to.eql(self.pizza1.ingredients[0].toString());
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should return one specific pizza and different of second pizza", () => {
      let self = this;
      return self.api
        .get('/pizzas/' + self.pizza2._id)
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response.name).to.not.eql(self.pizza1.name);
          expect(res.body.response.description).to.not.eql(self.pizza1.description);
          expect(res.body.response.priceCts).to.not.eql(self.pizza1.priceCts);
          expect(res.body.response.ingredients[0]._id.toString()).to.eql(self.pizza1.ingredients[0].toString());
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if id param doesn't have corresponding documents in mongoDB", () => {
      let self = this;
      return self.api
        .get('/pizzas/' + self.pizza1._id + 1)
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
      self.pizza1 = {
        name: "pizza1",
        image: "",
        description: "lorem ipsum1",
        priceCts: 200
      };
      self.pizza2 = {
        name: "pizza2",
        image: "",
        description: "lorem ipsum2",
        priceCts: 150
      };
      self.ingredient1 = {
        name: "ingredient1",
        weight: 150,
        priceCts: 150
      };

      return Promise.all([
        models.Pizza.remove({}),
        models.User.remove({}),
        models.Ingredient.remove({})
      ])

        .then(() => {
          return models.User.specials.signup(self.user1)
        })
        .then((user) => {
          self.user1._id = user._id;
          self.pizza1.cook = self.user1._id;
          return models.Ingredient.create(self.ingredient1);
        })
        .then((ingredient) => {
          self.pizza1.ingredients = [ingredient._id];
          self.pizza2.ingredients = [ingredient._id];
          return models.Pizza.create(self.pizza1);
        })
        .then((pizza) => {
          self.pizza2.cook = self.user1._id;
          self.pizza1._id = pizza._id;
          return models.Pizza.create(self.pizza2);
        })
        .then((pizza) => {
          self.pizza2._id = pizza._id;
          return self.api.post('/users/signin')
            .send({
              email: self.user1.email,
              password: self.user1.password
            })
        })
        .then((res) => {
          self.user1.token = res.body.response;
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should remove one specific pizza", () => {
      let self = this;
      return self.api
        .del('/pizzas/' + self.pizza1._id)
        .set('Authorization', self.user1.token)
        .then((res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body.response).to.eql(true);
        })
        .catch((err) => {
          throw (err.response) ? Error(err.response.body.Error) : err;
        })
    });

    it("should error if id param doesn't have corresponding documents in mongoDB", () => {
      let self = this;
      return self.api
        .del('/pizzas/' + self.pizza1._id + 1)
        .set('Authorization', self.user1.token)
        .catch((err) => {
          expect(err.status).to.eql(404);
        })
    });

    it("should error if token is not present", () => {
      let self = this;
      return self.api
        .del('/pizzas/' + self.pizza1._id)
        .catch((err) => {
          expect(err.status).to.eql(403);
          expect(err.response.body).to.eql({"error": "Token missing"});
        })
    });
  });

});
