const request = require("supertest");
const app = require("../src/app");
const axios = require("axios");

jest.mock("axios"); // Mock axios for the image search

it("should add a new book", async () => {
  const response = await request(app)
    .post("/branch_librarian/inventory/new?_id=6751ad6f03c78612cda4600e")
    .send({
      media_title: "Test Book",
      author: "Test Author",
      genre_id: "673358a98c529a6a6ec66a65",
      quant: 10,
    });

  expect(response.status).toBe(302); // Expect the redirect status
  expect(response.headers.location).toBe(
    "/branch_librarian/librarianInventory?_id=6751ad6f03c78612cda4600e"
  ); // Verify the redirect URL
});
