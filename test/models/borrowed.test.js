const { borrowMedia } = require('../../src/controllers/user.js');
const Borrowed = require('../../db/models/borrowed.js'); 

const { restore, spy, stub } = require('sinon');
const { expect } = require('chai');

const mockObjectIdMedia = '67436541cf72a0ab8f7f9b05';
const mockUserId = '6746f827c252ba3cb36816bc';

describe('Borrow Media Controller', function () {
    afterEach(() => restore()); 

    it('should successfully borrow media and redirect with success message', async function () {
        const mockRequest = { body: { media_id: mockObjectIdMedia }, user: { _id: mockUserId } };
        const mockResponse = { redirect: spy() };

        stub(Borrowed, 'borrowMedia').resolves({ _id: mockUserId });

        await borrowMedia(mockRequest, mockResponse);

        expect(mockResponse.redirect.calledWith('/user/view_media/67436541cf72a0ab8f7f9b05?_id=6746f827c252ba3cb36816bc&status=success&message=Media borrowed successfully')).to.be.true;
    });

    it('should redirect with an error message if borrowing fails', async function () {
        const mockRequest = { body: { media_id: mockObjectIdMedia }, user: { _id: mockUserId } };
        const mockResponse = { redirect: spy() };

        stub(Borrowed, 'borrowMedia').rejects(new Error('Borrow failed'));

        await borrowMedia(mockRequest, mockResponse);

        expect(mockResponse.redirect.calledWith('/user/view_media/67436541cf72a0ab8f7f9b05?_id=6746f827c252ba3cb36816bc&status=error&message=An error occurred while borrowing media')).to.be.true;
    });
});