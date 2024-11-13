exports.getLibrarianDashboard = (req, res) => {
    const userData = {
        role: 'librarian',  // Hardcoded for now, but in a real app, you would get this from the logged-in user session or database
      };
    res.render('branch_librarian/librarian_dashboard', { user: userData});  // Assuming you pass librarian user data
    console.log('Librarian dashboard data sent');
};