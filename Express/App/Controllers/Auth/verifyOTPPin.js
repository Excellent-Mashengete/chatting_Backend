const { OTPPin } = require("../../Utils/createOTP");
const jwt = require('jsonwebtoken');
const db = require("../../Models");
const users = db.Users;
const Sequelize = db.Sequelize;

module.exports.VerifyOTP = async (req, res) => {
    const { OTP, email } = req.body;

    if(!OTP) return res.status(400).json({ error: 'OTP is required.' });
    
    try{
        //check if OTP and email of a user exists
        const user = await users.findOne({
            where: {
                [Sequelize.Op.and]: [{
                        email: email
                    },
                    {
                        OTP_Pin: OTP
                    }
                ]
            }
        });

        if(!user){ 
            return res.status(404).json({ error: 'Invalid OTP'})
        }else{
            //Update the OTP with a new OTP to revoke the old token 
            await users.update({
                isLoogedIn: true,
                OTP_Pin: OTPPin() 
            }, {
                where: {
                    email: user.dataValues.email
                }
            });
            
            //Create a JWT token key for the user to receive in the frontend
            const accessToken = jwt.sign({ 
                    "id": user.dataValues.id
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '86400' }
            );

            return res.status(200).json({ message: 'OTP PIN verified successfully!', phone: user.dataValues.phone, name: user.dataValues.firstname + " " + user.dataValues.lastname, token :accessToken, isLoogedIn: user.dataValues.isLoogedIn });
        }
    }catch(e) {
        res.status(500).json({error: "Database error while trying to verify a user!" });
    }
}