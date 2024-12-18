
const { restore, spy, stub } = require('sinon');
const { expect } = require('chai');
const { borrowMedia } = require('../../src/controllers/user.js');
const Borrowed = require('../../db/models/borrowed.js');
const {Media} = require('../../db/models/inventory.js');
const {Customer} = require('../../db/models/customer');
const { markAsReturned } = require('../../src/controllers/user.js');
const mockObjectIdMedia = '67436541cf72a0ab8f7f9b05'; 
const mockUserId = '6746f827c252ba3cb36816bc';

describe('Controller: borrowMedia', function () {
  afterEach(() => restore()); // Cleanup after each test
  
  it('should successfully borrow media and redirect with success message', async function () {
    const req = {
      body: { media_id: mockObjectIdMedia }, 
      user: { _id: mockUserId } 
    };
    const res = { redirect: spy() };

    stub(Borrowed, 'borrowMedia').resolves({ _id: mockUserId });

    await borrowMedia(req, res);

    expect(res.redirect.calledWith(`/user/view_media/67436541cf72a0ab8f7f9b05?_id=6746f827c252ba3cb36816bc&status=success&message=Media borrowed successfully`)).to.be.true;
    
  });

  it('should redirect with an error if media is unavailable', async function () {
    const req = { body: { media_id: mockObjectIdMedia }, user: { _id: mockUserId } };
    const res = { redirect: spy() };

    stub(Borrowed, 'borrowMedia').resolves(null); 

    await borrowMedia(req, res);

    expect(res.redirect.calledWith(`/user/view_media/67436541cf72a0ab8f7f9b05?_id=6746f827c252ba3cb36816bc&status=error&message=Unable to borrow media`)).to.be.true;
  });

  it('should catch and handle database errors gracefully', async function () {
    const req = { body: { media_id: mockObjectIdMedia }, user: { _id: mockUserId } };
    const res = { redirect: spy() };

    stub(Borrowed, 'borrowMedia').throws(new Error('DB Error'));

    await borrowMedia(req, res);

    expect(res.redirect.calledWith(`/user/view_media/67436541cf72a0ab8f7f9b05?_id=6746f827c252ba3cb36816bc&status=error&message=An error occurred while borrowing media`)).to.be.true;
  });

});

describe('Controller: markAsReturned', function () {
    afterEach(() => restore());
  
    it('should successfully return the media and increase quantity', async function () {
      const req = { params: { id: mockObjectIdMedia }, user: { _id: mockUserId } };
      const res = { redirect: spy() };
  
      stub(Borrowed, 'findById').resolves({ 
        media_id: mockObjectIdMedia, 
        save: stub().resolves() 
      });
      stub(Media, 'findByIdAndUpdate').resolves({ quant: 10 }); 
      stub(Customer, 'findByIdAndUpdate').resolves();
  
      await markAsReturned(req, res);
  
      expect(res.redirect.calledWith(`/user/borrowed_media?_id=6746f827c252ba3cb36816bc&status=success&message=Media returned successfully`)).to.be.true;
    });
  
    it('should return 404 if the borrowed item is not found', async function () {
      const req = { params: { id: '6755aae5de7f447db418fd55' }, user: { _id: mockUserId } };
      const res = { status: stub().returnsThis(), send: spy() };
  
      stub(Borrowed, 'findById').resolves(null); 
  
      await markAsReturned(req, res);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.send.calledWith('Borrowed item not found')).to.be.true;
    });
  
    it('should catch errors and respond with 500', async function () {
      const req = { params: { id: "6755aae5de7f447db418fd55" }, user: { _id: mockUserId} }; //paarams id is a fukcinh borrowed id
      const res = { status: stub().returnsThis(), send: spy() };
  
      stub(Borrowed, 'findById').throws(new Error('DB Error'));
  
      await markAsReturned(req, res);
  
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('An error occurred while marking the media as returned')).to.be.true;
    });
  
  });