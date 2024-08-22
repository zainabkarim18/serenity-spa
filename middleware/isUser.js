// const isAdmin = require("./isAdmin.js");
// const isUser = require("../middleware/isUser.js");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

function isUser (req, res, next){
try{
    const token = req.headers.authorization.split(' ')[1];
    const tokenSplit = token.split('.');
    const tokenRole = JSON.parse(Buffer.from(tokenSplit[1], 'base64').toString());

    if (tokenRole.role !== "user") {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();

} catch (err) {
    console.log(err);
}

    // console.log(req.user);

    // if (req.user.role !== "admin") {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    // next();
}

module.exports = isUser;




