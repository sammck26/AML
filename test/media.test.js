const request = require("supertest");
const app = require("../src/app");
const axios = require("axios");

jest.mock("axios"); // Mock axios for the image search

it("should add a new book", async () => {
  const response = await request(app)
    .post("/branch_librarian/inventory/new?_id=6751ad6f03c78612cda4600e")
    .send({
      media_title: "Test Book2",
      author: "Test Author",
      genre_id: "673358a98c529a6a6ec66a65",
      quant: 10,
    });

  expect(response.status).toBe(302); // Expect the redirect status
  expect(response.headers.location).toBe(
    "/branch_librarian/librarianInventory?_id=6751ad6f03c78612cda4600e"
  ); // Verify the redirect URL
});

// Test for updating media quantity
it("should update the media quantity", async () => {
  const response = await request(app)
    .post(
      "/branch_librarian/inventory/update/67583a56b0ed45e4a805f03d?_id=6751ad6f03c78612cda4600e"
    )
    .send({
      newQuantity: 15, // Update the quantity
    });

  expect(response.status).toBe(302); // Expect the redirect status
  expect(response.headers.location).toBe(
    "/branch_librarian/librarianInventory?_id=6751ad6f03c78612cda4600e"
  ); // Verify the redirect URL
});

// Test for deleting a media item
it("should delete the media item", async () => {
  const response = await request(app).post(
    "/branch_librarian/inventory/delete/67583a56b0ed45e4a805f03d?_id=6751ad6f03c78612cda4600e"
  );

  expect(response.status).toBe(302); // Expect the redirect status
  expect(response.headers.location).toBe(
    "/branch_librarian/librarianInventory?_id=6751ad6f03c78612cda4600e"
  ); // Verify the redirect URL
});

it("should return 400 if required fields are missing when adding a new media item", async () => {
  const response = await request(app)
    .post("/branch_librarian/inventory/new?_id=6751ad6f03c78612cda4600e")
    .send({
      author: "Test Author", // Missing media_title and other fields
    });

  expect(response.status).toBe(400);
  expect(response.text).toContain("All fields are required.");
});

it("should return 400 if newQuantity is negative", async () => {
  const response = await request(app)
    .post(
      "/branch_librarian/inventory/update/67583a56b0ed45e4a805f03d?_id=6751ad6f03c78612cda4600e"
    )
    .send({
      newQuantity: -5, // Test with invalid quantity
    });

  expect(response.status).toBe(400); // Expect the redirect status

});

/*it("should return 401 if user is not authenticated when adding a media item", async () => {
  const response = await request(app)
    .post("/branch_librarian/inventory/new?_id=6751ad6f03c78612cda4600b")
    .send({
      media_title: "Test Book2",
      author: "Test Author",
      genre_id: "673358a98c529a6a6ec66a65",
      quant: 10,
    });

  expect(response.status).toBe(401);
  expect(response.text).toContain("Unauthorized access");
});

it("should return 400 if genre_id is invalid when adding a new media item", async () => {
  const response = await request(app)
    .post("/branch_librarian/inventory/new?_id=6751ad6f03c78612cda4600e")
    .send({
      media_title: "Test Book3",
      author: "Test Author",
      genre_id: "invalidGenreId", // Invalid genre ID
      quant: 10,
    });

  expect(response.status).toBe(400);
  expect(response.text).toContain("Invalid genre ID");
});*/
