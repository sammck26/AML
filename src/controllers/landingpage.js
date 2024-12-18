
//src/controllers/landingpage.js
const defaultUser = {
  role_id: {
      role_description: 'guest',
  },
};

exports.getLandingPage = (req, res) => {
    // Render the landing.ejs template inside the landingpage folder
    
  res.render('landingpage/landing', { user: defaultUser, activePage: 'home' });
    //console.log('Landing page rendered');
};

exports.getLoginPage = (req, res) => { // Sample data
  const userData = {
    role: "guest", // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
  };
  res.render("landingpage/login", { user: defaultUser, activePage: "login" });
};

exports.getRegisterPage = (req, res) => {
  // Sample data
  const userData = {
    role: "guest", // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
  };
  res.render("landingpage/register", { user: defaultUser, activePage: "register" });
};