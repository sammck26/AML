exports.getProfile = (req, res) => {
  const userData = { name: "User", role: "customer" }; // Sample data
  res.render("user/view_profile", { user: userData, activePage: "profile" });
};

exports.getDashboard = (req, res) => { 
    //const userData = {};  // will fetch user dashboard data from database
    const userData = { name: "User", role: "customer" };

  res.render('user/user_dashboard', {user: userData, activePage: "dashboard"}); 
    //console.log('User dashboard data sent');
    
  };

exports.getWishlist = (req, res, next) => {
  const userData = { name: "User", role: "customer" }; 
  req.userData = userData; // Pass data to next controller
  next();
};


exports.getBorrowed = (req, res, next) => {
  const userData = { name: "User", role: "customer" };
  req.userData = userData; // Pass data to next controller
  next();
};
