const { expect } = require('chai');
const sinon = require('sinon');
const { viewBorrowed } = require('../../src/controllers/view_inventory.js');
const Borrowed = require('../../db/models/borrowed.js');
const {Media} = require('../../db/models/inventory.js');

const mockObjectIdMedia = '67436541cf72a0ab8f7f9b05';
const mockUserId = '6746f827c252ba3cb36816bc'; 
const mockBorrowedId = "6755aae5de7f447db418fd55"; 

describe('Controller: viewBorrowed', function () {
    afterEach(() => sinon.restore()); 

    it('should render borrowed media successfully', async function () {
      const req = { 
        user: { _id: mockUserId }, 
        query: { page: 1, limit: 10 } 
      };
      const res = { 
        status: sinon.stub().returnsThis(), 
        send: sinon.spy(),
        render: sinon.spy()
      };

     
      const BorrowedFindStub = sinon.stub(Borrowed, 'find');
      BorrowedFindStub.onCall(0).resolves([{ 
        _id: mockBorrowedId, 
        media_id: mockObjectIdMedia 
      }]);

      
     
      const queryStub = {
        populate: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves([{ 
          _id: mockBorrowedId,
          media_id: {
            media_title: 'The Book Thief', 
            author: 'Markus Zusak', 
            genre_id: { genre_description: 'Thriller' }
          }
        }])
      };
      BorrowedFindStub.onCall(1).returns(queryStub);

      const mediaFindQueryStub = { //kill me... needs .exec() to resolve
        select: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves([{ _id: mockObjectIdMedia }])
      };
      
      sinon.stub(Media, 'find').returns(mediaFindQueryStub);
      await viewBorrowed(req, res);

      
      expect(res.render.calledWithMatch('user/borrowed_media.ejs', {
        items: sinon.match.array, 
        user: req.user, 
        activePage: 'borrowed_media', 
        currentPage: 1, 
        totalPages: sinon.match.number
      })).to.be.true;
    });

    it('should catch and respond with 500 on error', async function () {
      const req = { 
        user: { _id: mockUserId }, 
        query: { page: 1, limit: 10 } 
      };
      const res = { status: sinon.stub().returnsThis(), send: sinon.spy() };

      // Simulate error on Borrowed.find
      sinon.stub(Borrowed, 'find').throws(new Error('DB Error'));

      await viewBorrowed(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('An error occurred while fetching borrowed media')).to.be.true;
    });
});
