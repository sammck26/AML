exports.getDashboard = (req, res) => { 
    //const userData = {};  // will fetch user dashboard data from database
    const userData = {
        role: 'customer',  // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
      };
    res.render('user/user_dashboard', { user: userData }); 
    //console.log('User dashboard data sent');

};

exports.getProfile = (req, res) => {
  //const userData = {};  // will fetch user dashboard data from database
  const userData = {
    role: "customer", // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
  };
  res.render("user/view_profile", { user: userData });
  //console.log('User dashboard data sent');
};



