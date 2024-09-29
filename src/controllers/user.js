exports.getDashboard = (req, res) => { 
    const userData = {};  // Logic to fetch user dashboard data
    res.render('/user/user_dashboard', { user: userData }); 
  };