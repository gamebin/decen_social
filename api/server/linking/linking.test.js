const request = require("supertest-as-promised");
const httpStatus = require("http-status");
const chai = require("chai"); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require("../../index");
const faker = require("faker/locale/en");

let fake_userid = faker.internet.userName().substr(0, 10);
let fake_username = faker.name.findName().substr(0, 10);
let fake_comments = faker.lorem.text();

chai.config.includeStack = true;

/**
 * root level hooks
 */
after(done => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  // mongoose.models = {};
  // mongoose.modelSchemas = {};
  // mongoose.connection.close();
  done();
});

describe("## Linking APIs", () => {
  let friendData = {
    userid   : "gamekiki",
    friendId : "Madisyn89"
  };

  let likedData = {
    boardSerno : "2",
    userId     : "gamekiki",
    userid     : "gamekiki"
  };

  const validUserCredentials = {
    userid     : "gamekiki",
    userpasswd : "gamekiki@password",
    username   : "gamekiki name",
    email      : "gamekiki@gamekiki.com"
  };

  let headers = { "x-access-token": "" };

  describe("# POST /api/linking/follow", () => {
    it("should create a new friend", done => {
      request(app)
        .post("/api/auth/login")
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then(res => {
          console.debug("res.body:", res.body);
          expect(res.body).to.have.property("token");
          validUserCredentials.userserno = res.body.userserno;
          headers["x-access-token"] = res.body.token;
          friendData.userid = validUserCredentials.userid;
          request(app)
            .post("/api/linking/follow")
            .set(headers)
            .send(friendData)
            .expect(httpStatus.OK)
            .then(res => {
              friendData.friendSerno = res.body.friendSerno;
              done();
            })
            .catch(done);
        })
        .catch(err => {
          console.error(err);
          done(err);
        });
    }).timeout(10000);
  });

  describe("# DELETE /api/linking/remove", () => {
    it("should report error", done => {
      friendData.friendId = "test1234";
      request(app)
        .delete(`/api/linking/remove`)
        .set(headers)
        .send(friendData)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          done();
        })
        .catch(done);
    }).timeout(10000);

    it("should delete friend", done => {
      friendData.friendId = "Madisyn89";
      request(app)
        .delete(`/api/linking/remove`)
        .set(headers)
        .send(friendData)
        .expect(httpStatus.OK)
        .then(res => {
          done();
        })
        .catch(done);
    }).timeout(10000);
  });

  describe("# POST /api/linking/like", () => {
    it("should create a new liked", done => {
      request(app)
        .post("/api/linking/like")
        .set(headers)
        .send(likedData)
        .expect(httpStatus.OK)
        .then(res => {
          done();
        })
        .catch(done);
    }).timeout(10000);
  });
});
