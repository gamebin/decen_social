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

let boardData = {
  boardtext : fake_comments,
  userid    : "gamekiki",
  title     : "gamekiki title"
};

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

describe("## Board APIs", () => {
  const validUserCredentials = {
    userid     : "gamekiki",
    userpasswd : "gamekiki@password",
    username   : "gamekiki name",
    email      : "gamekiki@gamekiki.com"
  };
  let headers = { "x-access-token": "" };

  describe("# POST /api/boards", () => {
    it("should create a new board", done => {
      boardData.boardtext = fake_comments;
      boardData.userid = fake_userid;
      boardData.title = fake_username;

      request(app)
        .post("/api/auth/login")
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then(res => {
          console.debug("res.body:", res.body);
          expect(res.body).to.have.property("token");
          validUserCredentials.userserno = res.body.userserno;
          headers["x-access-token"] = res.body.token;
          boardData.userid = validUserCredentials.userid;
          request(app)
            .post("/api/boards")
            .set(headers)
            .send(boardData)
            .expect(httpStatus.OK)
            .then(res => {
              expect(res.body.result.title).to.equal(boardData.title);
              boardData.boardSerno = res.body.result.boardSerno;
              done();
            })
            .catch(done);
        })
        .catch(err => {
          console.error(err);
          done(err);
        });
    });
  });

  describe("# GET /api/boards/:boardSerno", () => {
    it("should get board details", done => {
      request(app)
        .get(`/api/boards/${boardData.boardSerno}`)
        .expect(httpStatus.OK)
        .then(res => {
          // expect(res.body.username).to.equal(userData.username);
          done();
        })
        .catch(done);
    }).timeout(10000);

    it("should report error with message - Not found, when board does not exists", done => {
      request(app)
        .get("/api/boards/56c787ccc")
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal("Not Found");
          done();
        })
        .catch(done);
    });
  });

  describe("# PUT /api/boards/:boardSerno", () => {
    it("should update board details", done => {
      boardData.title = "KK789";
      request(app)
        .put(`/api/boards/${boardData.boardSerno}`)
        .set(headers)
        .send(boardData)
        .expect(httpStatus.OK)
        .then(res => {
          console.debug("res.body:", res.body);
          done();
        })
        .catch(done);
    }).timeout(10000);
  });

  describe("# DELETE /api/boards/", () => {
    it("should delete board", done => {
      request(app)
        .delete(`/api/boards/${boardData.boardSerno}`)
        .set(headers)
        .send(boardData)
        .expect(httpStatus.OK)
        .then(res => {
          done();
        })
        .catch(done);
    }).timeout(10000);
  });
});
