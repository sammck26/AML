
// src/controllers/landingpage.js

exports.getLandingPage = (req, res) => {
    // Render the landing.ejs template inside the landingpage folder
    const user = { name: 'Sam McKibben'};  // Dummy user data
    res.render('landingpage/landing', { user });
    console.log('Landing page rendered');
  };