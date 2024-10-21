const app = require('./app.js');  // Import the app setup from app.js
const port = 3000;

// Starts the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
