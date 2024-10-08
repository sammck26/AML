exports.getLibrarianDashboard = (req, res) => {
    
    res.render('branch_librarian/librarian_dashboard', { librarian: req.user });  // Assuming you pass librarian user data
    console.log('Librarian dashboard data sent');
};