
//src/controllers/landingpage.js

exports.getLandingPage = (req, res) => {
    // Render the landing.ejs template inside the landingpage folder
    const defaultUser = {
      role_id: {
          role_description: 'guest',
      },
  };
  res.render('landingpage/landing', { user: defaultUser, activePage: 'home' });
    //console.log('Landing page rendered');
};

exports.getLoginPage = (req, res) => { // Sample data
  const userData = {
    role: "guest", // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
  };
  res.render("landingpage/login", { user: userData, activePage: "login" });
};

exports.getRegisterPage = (req, res) => {
  // Sample data
  const userData = {
    role: "guest", // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
  };
  res.render("landingpage/register", { user: userData, activePage: "register" });
};