const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../index');

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe.skip('# Error Handling', () => {
    it('should handle express validation error - "username" is required and "userpasswd" is required', (done) => {
      request(app)
        .post('/api/users')
        .send({ userid: '1234567890' })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          // console.debug('res.body.message:', res.body.message);
          expect(res.body.message).to.equal('"username" is required and "userpasswd" is required');
          done();
        })
        .catch(done);
    });
  });
});
