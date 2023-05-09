const jwt = require('jsonwebtoken');

module.exports.verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'] ||  req.headers['Authorization'];
    try{
        const barerr  = authHeader.split(' ')[1];
       if (!authHeader) return res.status(401).json({ messages: "Unauthorized token missing" });


        jwt.verify(barerr || authHeader, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if(err) return res.status(403).json({message: "invalid token"})
            req.userId = decode.id;
            next();
        })
    }catch(e){
        return res.status(401).json({message: "unable to decode token"})
    }
}