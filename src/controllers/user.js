exports.getDashboard = (req, res) => { 
    const userData = {};  // will fetch user dashboard data from database
    res.render('user/user_dashboard.ejs', { user: userData }); 
    //console.log('User dashboard data sent');
  };