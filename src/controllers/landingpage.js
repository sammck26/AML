
//src/controllers/landingpage.js
const defaultUser = {
  role_id: {
    role_description: "guest",
  },
};

exports.getLandingPage = (req, res) => {
  res.render("landingpage/landing", { user: defaultUser, activePage: "home" });
  //console.log('Landing page rendered');
};

exports.getLoginPage = (req, res) => { // Sample data

  res.render("landingpage/login", { user: defaultUser, activePage: "login" });
};

exports.getRegisterPage = (req, res) => {

  res.render("landingpage/register", { user: defaultUser, activePage: "register" });
};