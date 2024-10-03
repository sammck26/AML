exports.getDashboard = (req, res) => { 
    const userData = {};  // will fetch user dashboard data from database
<<<<<<< HEAD
    res.render('user/user_dashboard.ejs', { user: userData }); 
    //console.log('User dashboard data sent');
=======
    res.render('user/user_dashboard', { user: userData }); 
    console.log('User dashboard data sent');
>>>>>>> 2794ca83bf3551fdb791b8b69b7da1d1806e19f9
  };