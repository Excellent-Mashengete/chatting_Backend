const db = require("../Models");
const users = db.Users;

module.exports.checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        // Username
        let user = await users.findOne({ where: { phone: req.body.phone} });
        if (user) return res.status(400).json({ message: "Failed! Phone is already in use!" });
        
        // Email
        user = await users.findOne({ where: { email: req.body.email} });
        if (user) return res.status(400).json({ message: "Failed! Email is already in use!" });

        next();
    } catch (error) {
        return res.status(500).json({ message: "Unable to validate phone or email!" });
    }
};