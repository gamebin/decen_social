const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

let userData = {
  token      : '',
  userserno  : '',
  userid     : 'kk123',
  username   : 'KK123',
  userpasswd : '1234567890'
};

beforeEach(async () => {
  const reqData = { userid: userData.userid, userpasswd: userData.userpasswd };
  const headers = {};
  const res = await request(app)
    .post('/api/auth/login')
    .set(headers)
    .send(reqData);

  // console.debug('res.body:', res.body);
  userData.token = res.body.token;
  userData.userserno = res.body.userserno;
  userData.userid = res.body.userid;
  userData.username = res.body.username;
  // console.debug('userData:', userData);
});

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  // mongoose.models = {};
  // mongoose.modelSchemas = {};
  // mongoose.connection.close();
  done();
});

describe('## User APIs', () => {
  describe('# POST /api/users', () => {
    it.skip('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(userData)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(userData.username);
          user = res.body;
          done();
        })
        .catch(done);
    });

    it('should create a auth error', (done) => {
      request(app)
        .post('/api/users')
        .send(userData)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message).to.equal('Authentication error');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      // console.debug('userData:', userData);
      request(app)
        .get(`/api/users/${userData.userserno}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(userData.username);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/56c787ccc')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      userData.username = 'KK789';
      console.debug('userData:', userData);
      request(app)
        .put(`/api/users/${userData.userserno}`)
        .send(userData)
        .expect(httpStatus.OK)
        .then((res) => {
          console.debug('res.body:', res.body);
          // expect(res.body.username).to.equal('KK789');
          done();
        })
        .catch(done);
    });
  });

  describe.skip('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .get('/api/users')
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe.skip('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('KK');
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        .catch(done);
    });
  });
});
