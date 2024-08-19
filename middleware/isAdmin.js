const isAdmin = require("../middleware/isAdmin.js");

function isAdmin(req, res, next) {
    console.log(req.user);

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}

module.exports = isAdmin;




