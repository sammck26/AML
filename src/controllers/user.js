exports.getDashboard = (req, res) => {
  const userData = { name: "User", role: "customer" };
  res.render("user/user_dashboard", {
    user: userData,
    activePage: "dashboard",
  });
};

exports.getProfile = (req, res) => {
  const userData = { name: "User", role: "customer" }; // Sample data
  res.render("user/view_profile", { user: userData, activePage: "profile" });
};
exports.getDashboard = (req, res) => { 
    //const userData = {};  // will fetch user dashboard data from database
    const userData = req.user;

    res.render('user/user_dashboard', { user: userData }); 
    //console.log('User dashboard data sent');
    
  };
