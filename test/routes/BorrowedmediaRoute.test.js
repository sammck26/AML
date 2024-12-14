const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app.js');
chai.use(chaiHttp);
const { request, expect } = chai;
const mockUserId = '6746f827c252ba3cb36816bc';
const mockObjectIdMedia = '67436541cf72a0ab8f7f9b05';

describe('API /user/borrow-media', function () {
  it('should return 404 if the media is not found', function (done) {
    request(app)
      .post('/user/borrow-media')
      .send({ media_id: mockObjectIdMedia, user_id: mockUserId }) 
      .end((err, res) => {
        expect(res).to.have.status(404); 
        done();
      });
  });
});