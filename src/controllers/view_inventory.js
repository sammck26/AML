//this is shitty mock data
const inventoryData = [
    { title: "Book 1", author: "Author A", status: "Available" },
    { title: "Book 2", author: "Author B", status: "Unavailable" },
    { title: "Book 3", author: "Author C", status: "Available" }
];

// hadnles viewing the inventory
exports.viewInventory = (req, res) => {
    const userData = req.user;

    res.render('user/show_media', { inventory: inventoryData, user: userData, activePage: "inventory" });
};