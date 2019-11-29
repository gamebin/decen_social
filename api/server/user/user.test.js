const mongoose = require('mongoose');
const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');
const faker = require('faker/locale/en');

let fake_userid = faker.internet.userName().substr(0, 10);
let fake_username = faker.name.findName().substr(0, 10);
let fake_userpasswd = pad(faker.random.number(1000000, 9999999, 0), 4, 0)

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

chai.config.includeStack = true;

let userData = {
  userid     : 'gamekiki',
  username   : 'gamekiki name',
  userpasswd : 'gamekiki@password'
};

beforeEach(async () => {
  // const reqData = { userid: 'gamekiki', username: 'gamekiki name', userpasswd: 'gamekiki@password' };
  // const headers = {};
  // const res = await request(app)
  //   .post('/api/auth/login')
  //   .set(headers)
  //   .send(reqData);

  // // console.debug('res.body:', res.body);
  // userData.token = res.body.token;
  // userData.userserno = res.body.userserno;
  // userData.userid = res.body.userid;
  // userData.username = res.body.username;
  // // console.debug('userData:', userData);
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
  describe.skip('# POST /api/users', () => {
    it('should create a new user', (done) => {
      userData.userid = fake_userid;
      userData.username = fake_username;
      // userData.userpasswd = fake_userpasswd;
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
      userData.userid = 'gamekiki';
      userData.username = fake_username;
      // userData.userpasswd = fake_userpasswd;
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
      userData.userid = 'gamekiki';
      userData.username = 'gamekiki name';
      userData.userpasswd = 'gamekiki@password';
      request(app)
        .post('/api/auth/login')
        .send(userData)
        .then((res) => {
          userData.userserno = res.body.userserno;
          console.debug('userData:', userData);
          request(app)
            .get(`/api/users/${userData.userserno}`)
            .expect(httpStatus.OK)
            .then((res) => {
              // expect(res.body.username).to.equal(userData.username);
              done();
            })
            .catch(done);
        })
        .catch(done);
    }).timeout(10000);

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
      userData.userid = 'gamekiki';
      userData.username = 'gamekiki name';
      userData.userpasswd = 'gamekiki@password';
      request(app)
        .post('/api/auth/login')
        .send(userData)
        .then((res) => {
          userData.userserno = res.body.userserno;
          userData.username = 'KK789';
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
        })
        .catch(done);
    }).timeout(10000);
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      userData.userid = 'gamekiki';
      userData.username = 'gamekiki name';
      userData.userpasswd = 'gamekiki@password';
      request(app)
        .post('/api/auth/login')
        .send(userData)
        .then((res) => {
          userData.userserno = res.body.userserno;
          request(app)
            .delete(`/api/users/${userData.userserno}`)
            .expect(httpStatus.OK)
            .then((res) => {
              // expect(res.body.username).to.equal('KK');
              // expect(res.body.mobileNumber).to.equal(user.mobileNumber);
              done();
            })
            .catch(done);
        })
        .catch(done);
    }).timeout(10000);
  });
});
