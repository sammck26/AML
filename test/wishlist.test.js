const request = require("supertest");
const app = require("../src/app");

it("should add a media item to the wishlist", async () => {
  const response = await request(app)
    .post("/user/add_to_wishlist?_id=6746f827c252ba3cb36816bc")
    .send({
      media_id: "67583a56b0ed45e4a805f03d", // Example media ID
    });


  expect(response.status).toBe(302); // Expect redirect status
  expect(response.headers.location).toContain(
    "/user/view_media/67583a56b0ed45e4a805f03d"
  ); // Check for redirect URL containing media ID
  expect(response.headers.location).toContain("status=success");
  expect(response.headers.location).toContain(
    "Item%20added%20to%20wishlist"
  );
});


/*it("should return an error if the user is not found", async () => {
  const response = await request(app).post("/user/add_to_wishlist").send({
    media_id: "675839e0dc17d6145b4acaf8", // Example media ID
  });

  expect(response.status).toBe(302); // Expect redirect status
  expect(response.headers.location).toContain(
    "/user/view_media/673358a98c529a6a6ec66a65?_id="
  );
  expect(response.headers.location).toContain("status=error");
  expect(response.headers.location).toContain("message=User not found");
});

it("should return an error if the media item is already in the wishlist", async () => {
  // Mock user with existing wishlist
  const user = {
    _id: "6751ad6f03c78612cda4600e",
    wishlist: ["673358a98c529a6a6ec66a65"], // Media already in wishlist
    save: jest.fn(),
  };

  jest.spyOn(User, "findById").mockResolvedValue(user);

  const response = await request(app).post("/user/wishlist/add").send({
    media_id: "673358a98c529a6a6ec66a65", // Duplicate media ID
  });

  expect(response.status).toBe(302); // Expect redirect status
  expect(response.headers.location).toContain(
    "/user/view_media/673358a98c529a6a6ec66a65?_id="
  );
  expect(response.headers.location).toContain("status=error");
  expect(response.headers.location).toContain(
    "message=Media item already in wishlist"
  );
});*/

it("should remove a media item from the wishlist", async () => {
  const response = await request(app)
    .post("/user/remove_from_wishlist?_id=6746f827c252ba3cb36816bc")
    .send({
      item_id: "67583a56b0ed45e4a805f03d", // Example media ID
    })

  expect(response.status).toBe(302); // Expect redirect status
  expect(response.headers.location).toContain("status=success");
});
