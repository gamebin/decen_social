const request = require("supertest-as-promised");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const chai = require("chai"); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require("../../index");
const config = require("../../config/config");
const faker = require("faker/locale/en");

let fake_userid = faker.internet.userName().substr(0, 10);
let fake_username = faker.name.findName().substr(0, 10);
let fake_userpasswd = pad(faker.random.number(1000000, 9999999, 0), 4, 0);
let fake_useremail = faker.internet.email();

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

chai.config.includeStack = true;

describe("## Auth APIs", () => {
  const validUserCredentials = {
    userid     : fake_userid,
    userpasswd : fake_userpasswd,
    username   : fake_username,
    email      : fake_useremail
  };

  const invalidUserCredentials = {
    userid     : "gamekiki",
    userpasswd : "gamekiki@"
  };

  let headers = { "x-access-token": "" };
  let jwtToken;

  describe("# POST /api/auth/signup", () => {
    it("should return create success code", done => {
      request(app)
        .post("/api/auth/signup")
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then(res => {
          done();
          // console.debug('/api/auth/signup res.body:', res.body);
          // expect(res.body).to.have.property('token');
          // jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
          //   expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
          //   expect(decoded.username).to.equal(validUserCredentials.username);
          //   jwtToken = `Bearer ${res.body.token}`;
          //   done();
          // });
        })
        .catch(done);
    }).timeout(10000);
  });

  describe("# POST /api/auth/login", () => {
    it("should return Authentication error", done => {
      request(app)
        .post("/api/auth/login")
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal("Authentication error");
          done();
        })
        .catch(done);
    });

    it("should get valid JWT token", done => {
      request(app)
        .post("/api/auth/login")
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then(res => {
          console.debug("res.body:", res.body);
          expect(res.body).to.have.property("token");
          validUserCredentials.userserno = res.body.userserno;
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
            expect(decoded.userid).to.equal(validUserCredentials.userid);
            jwtToken = `Bearer ${res.body.token}`;
            headers["x-access-token"] = res.body.token;
            done();
          });
        })
        .catch(err => {
          console.error(err);
          done(err);
        });
    });
  });

  describe("# POST /api/auth/logout", () => {
    it("should return success code", done => {
      request(app)
        .post("/api/auth/logout")
        .set(headers)
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then(res => {
          request(app)
            .delete(`/api/users/${validUserCredentials.userserno}`)
            .expect(httpStatus.OK)
            .then(res => {
              // expect(res.body.username).to.equal('KK');
              // expect(res.body.mobileNumber).to.equal(user.mobileNumber);
              done();
            })
            .catch(done);

          //   expect(res.body).to.have.property('token');
          //   jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
          //     expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
          //     expect(decoded.username).to.equal(validUserCredentials.username);
          //     jwtToken = `Bearer ${res.body.token}`;
          //     done();
          //   });
        })
        .catch(done);
    });
  });

  describe("# GET /api/auth/random-number", () => {
    it("should fail to get random number because of missing Authorization", done => {
      request(app)
        .get("/api/auth/random-number")
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal("Unauthorized");
          done();
        })
        .catch(done);
    });

    it("should fail to get random number because of wrong token", done => {
      request(app)
        .get("/api/auth/random-number")
        .set("Authorization", "Bearer inValidToken")
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal("Unauthorized");
          done();
        })
        .catch(done);
    });

    it("should get a random number", done => {
      request(app)
        .get("/api/auth/random-number")
        .set("Authorization", jwtToken)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.num).to.be.a("number");
          done();
        })
        .catch(done);
    });
  });
});
