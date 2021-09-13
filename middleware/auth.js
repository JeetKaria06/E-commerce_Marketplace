const jwt = require("jsonwebtoken")

// const dotenv = require('dotenv');
// dotenv.config();

const vertifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token)
    {
        return res.status(403).send('Can not find authentication token in request body or request query or in "x-access-token" key in header!');
    }

    try
    {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = {"username": decoded.username, "type": decoded.type};
    }
    catch
    {
        return res.status(401).send("Invalid Token!");
    }
    return next();
};

module.exports = vertifyToken;