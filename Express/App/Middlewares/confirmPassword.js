const db = require("../Models");
const users = db.Users;

module.exports.ConfirmPassword = async (req, res, next) => {
    const newpassword = req.body['newpassword'];
    const confirmPassword = req.body['confirmPassword'];

    if (!newpassword){ 
        return res.status(400).json({ error: 'newpassword is required.' });
    }else if (!confirmPassword) {
        return res.status(400).json({ error: 'confirmPassword is required.' });
    }else if (confirmPassword != newpassword) {
        return res.status(400).json({ error: 'confirmPassword mismatch' });
    }
    next();
};