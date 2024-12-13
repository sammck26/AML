const request = require("supertest");
const app = require("../src/app");
const express = require("express"); // Import express
const { addToWishlist } = require("../src/controllers/user");

/*it("should add a media item to the wishlist", async () => {
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

it("should return an error if the user is not found", async () => {
  const media_id = "675839e0dc17d6145b4acaf8"; // Example media ID

  const response = await request(app).post("/user/add_to_wishlist").send({
    media_id,
  });

  expect(response.status).toBe(400); // client side error
});*/


it("should return an error if the media item is already in the wishlist", async () => {
  // Mock user with media already in wishlist
  const user = {
    _id: "672a90e2211aef12e04c0067",
    wishlist: ["6751b014a43b53616a371697"], // Media ID already exists
    save: jest.fn(),
  };

  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = user; // Mock authenticated user
    next();
  });
  app.post("/user/add_to_wishlist", addToWishlist);

  // Make the test request
  const response = await request(app).post("/user/add_to_wishlist").send({
    media_id: "6751b014a43b53616a371697", // Media ID already in the wishlist
  });

  // Assert the response status and redirect URL
  expect(response.status).toBe(302); // Redirect status
  expect(response.headers.location).toContain(
    `/user/view_media/6751b014a43b53616a371697?_id=672a90e2211aef12e04c0067&status=error&message=Media%20item%20already%20in%20wishlist`
  );
});



/*it("should remove a media item from the wishlist", async () => {
  const response = await request(app)
    .post("/user/remove_from_wishlist?_id=6746f827c252ba3cb36816bc")
    .send({
      item_id: "67583a56b0ed45e4a805f03d", // Example media ID
    })

  expect(response.status).toBe(302); // Expect redirect status
  expect(response.headers.location).toContain("status=success");
});*/
