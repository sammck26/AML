const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Path to your Express app
const { Media } = require("../db/models/inventory");
const { expect } = chai;

chai.use(chaiHttp);

describe("Manage Media - Librarian Features", () => {
  let testMediaId;

  // Test for adding a book
  describe("POST /branch_librarian/addBook", () => {
    it("should add a new book", (done) => {
      const newBook = {
        media_title: "Test Book",
        author: "John Doe",
        genre_id: "5f8d0d55b54764421b7156bc", // Replace with a valid genre ID from your database
        quant: 10,
      };

      chai
        .request(app)
        .post("/branch_librarian/addBook")
        .send(newBook)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.include("redirect"); // Check for redirection
          Media.findOne({ media_title: newBook.media_title }).then((media) => {
            expect(media).to.exist;
            testMediaId = media._id; // Save ID for other tests
            done();
          });
        });
    });
  });

  // Test for fetching media details for update
  describe("GET /branch_librarian/updateBook/:id", () => {
    it("should fetch the media item to update", (done) => {
      chai
        .request(app)
        .get(`/branch_librarian/updateBook/${testMediaId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.include("Test Book"); // Check if the book title appears in the response
          done();
        });
    });
  });

  // Test for updating media quantity
  describe("PUT /branch_librarian/updateMediaQuantity/:id", () => {
    it("should update the media quantity", (done) => {
      const updatedData = { newQuantity: 20 };

      chai
        .request(app)
        .put(`/branch_librarian/updateMediaQuantity/${testMediaId}`)
        .send(updatedData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          Media.findById(testMediaId).then((media) => {
            expect(media.quant).to.equal(20);
            done();
          });
        });
    });
  });

  // Test for deleting media
  describe("DELETE /branch_librarian/deleteMedia/:id", () => {
    it("should delete the media item", (done) => {
      chai
        .request(app)
        .delete(`/branch_librarian/deleteMedia/${testMediaId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          Media.findById(testMediaId).then((media) => {
            expect(media).to.be.null;
            done();
          });
        });
    });
  });
});
