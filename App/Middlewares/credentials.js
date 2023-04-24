const allowedOrigins = require('../Configs/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', "Access-Control-Allow-Headers", 
            "Origin, Content-Type, Accept", true);
    }
    next();
}

module.exports = credentials