const jwt = require('jsonwebtoken');

// generate a token
const generateToken = function (user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
}

const isRay = function (req, res, next) {

    console.log(req.user);

    // extra checking
    if (!req.user.isAdmin || req.authInfo.scope != "all") {
        res.status(401).send('Unauthorized: Invalid role');
    }

    next();
}

module.exports = { generateToken, isRay };