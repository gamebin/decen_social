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

let productData = {
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

describe("## Product APIs", () => {
  describe("# POST /api/products", () => {
    it("should create a new product", done => {
      productData.boardtext = fake_comments;
      productData.userid = fake_userid;
      productData.title = fake_username;

      request(app)
        .post("/api/products")
        .send(productData)
        .expect(httpStatus.OK)
        .then(res => {
          // console.debug("res.body:", res.body);
          expect(res.body.result.title).to.equal(productData.title);
          productData.boardSerno = res.body.result.boardSerno;
          // console.debug("productData:", productData);
          done();
        })
        .catch(done);
    }).timeout(10000);
  });

  describe("# GET /api/products/:productSerno", () => {
    it("should get product details", done => {
      request(app)
        .get(`/api/products/${productData.boardSerno}`)
        .expect(httpStatus.OK)
        .then(res => {
          // expect(res.body.username).to.equal(userData.username);
          done();
        })
        .catch(done);
    }).timeout(10000);

    it("should report error with message - Not found, when product does not exists", done => {
      request(app)
        .get("/api/products/56c787ccc")
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal("Not Found");
          done();
        })
        .catch(done);
    });
  });

  describe("# PUT /api/products/:productSerno", () => {
    it("should update product details", done => {
      // productData.productSerno = "";
      productData.title = "KK789";
      request(app)
        .put(`/api/products/${productData.boardSerno}`)
        .send(productData)
        .expect(httpStatus.OK)
        .then(res => {
          console.debug("res.body:", res.body);
          // expect(res.body.username).to.equal('KK789');
          done();
        })
        .catch(done);
    }).timeout(10000);
  });

  describe("# DELETE /api/products/", () => {
    it("should delete product", done => {
      // productData.productSerno = "";
      request(app)
        .delete(`/api/products/${productData.boardSerno}`)
        .expect(httpStatus.OK)
        .then(res => {
          // expect(res.body.username).to.equal('KK');
          // expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        .catch(done);
    }).timeout(10000);
  });
});
