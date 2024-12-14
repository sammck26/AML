const sinon = require('sinon');
const { expect } = require('chai');
const { borrowMedia } = require('../../src/controllers/user'); // Correct path for user.js
const Borrowed = require('../../models/borrowed');
const Media = require('../../models/inventory');
const Customer = require('../../models/customer');

describe('User Controller - borrowMedia', function () {

  afterEach(() => {
    sinon.restore(); // Clean up all stubs after each test
  });

  it('should successfully borrow media and redirect with success message', async function () {
    // Arrange
    const req = {
      body: { media_id: 'mock-media-id' }, 
      user: { _id: 'mock-user-id' } 
    };
    const res = { 
      redirect: sinon.spy() 
    };

    // Mock the Borrowed model's borrowMedia method to return a valid borrowed item
    sinon.stub(Borrowed, 'borrowMedia').resolves({ _id: 'mock-borrowed-id' });

    // Act
    await borrowMedia(req, res);

    // Assert
    expect(res.redirect.calledWith(`/user/view_media/mock-media-id?_id=mock-user-id&status=success&message=Media borrowed successfully`)).to.be.true;
  });

  it('should redirect with an error if media cannot be borrowed (media not available)', async function () {
    // Arrange
    const req = {
      body: { media_id: 'mock-media-id' }, 
      user: { _id: 'mock-user-id' } 
    };
    const res = { 
      redirect: sinon.spy() 
    };

    // Mock the Borrowed model's borrowMedia method to return `null` to simulate a failed borrow
    sinon.stub(Borrowed, 'borrowMedia').resolves(null); 

    // Act
    await borrowMedia(req, res);

    // Assert
    expect(res.redirect.calledWith(`/user/view_media/mock-media-id?_id=mock-user-id&status=error&message=Unable to borrow media`)).to.be.true;
  });

  it('should catch errors and redirect with an error message', async function () {
    // Arrange
    const req = {
      body: { media_id: 'mock-media-id' }, 
      user: { _id: 'mock-user-id' } 
    };
    const res = { 
      redirect: sinon.spy() 
    };

    // Make Borrowed.borrowMedia throw an error
    sinon.stub(Borrowed, 'borrowMedia').throws(new Error('Database Error'));

    // Act
    await borrowMedia(req, res);

    // Assert
    expect(res.redirect.calledWith(`/user/view_media/mock-media-id?_id=mock-user-id&status=error&message=An error occurred while borrowing media`)).to.be.true;
  });

});