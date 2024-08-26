function isUser(req, res, next) {
    console.log(req.user);

    if (req.user.role !== "user") {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}

module.exports = isUser;
