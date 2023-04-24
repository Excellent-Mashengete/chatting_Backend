const { OTPPin } = require("../../Utils/createOTP");
const db = require("../../Models");
const bcrypt = require('bcrypt');
const users = db.Users;

//Register a new user
module.exports.register = async (req, res) => {
    const { firstname,  lastname, email, phone, avatar, password } = req.body

    try {  
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) return res.status(400).json({ message: "unable to protect password" });
            
            await users.create({
                firstname: firstname, lastname: lastname,
                email:email, phone:phone,
                OTP_Pin:OTPPin(), avatar: avatar, password: hash
            });

            return res.status(201).json({message: 'You have successfully registered' });
        })
    }catch(e) {
        res.status(500).json({message: "Database error while registring user!" });
    }
}
