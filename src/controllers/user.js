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