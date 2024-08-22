function isAdmin(req, res, next) {
    console.log(req.user);

    if (req.user.role !== "admin") {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}

module.exports = isAdmin;


// const isAdmin = require("../middleware/isAdmin.js");

// function isAdmin(req, res, next) {
// try{
//     const token = req.headers.authorization.split(' ')[1];
//     const tokenSplit = token.split('.');
//     const tokenRole = JSON.parse(Buffer.from(tokenSplit[1], 'base64').toString());

//     if (tokenRole.role !== "admin") {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     next();

// } catch (err) {
//     console.log(err);
// }

    // console.log(req.user);

    // if (req.user.role !== "admin") {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    // next();
// }

// module.exports = isAdmin;




