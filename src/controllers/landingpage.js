
//src/controllers/landingpage.js

exports.getLandingPage = (req, res) => {
    // Render the landing.ejs template inside the landingpage folder
    const userData = {
      role: 'guest',  // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
    };
  res.render("landingpage/landing", { user: userData, activePage: "landing" }); 
    //console.log('Landing page rendered');
};
