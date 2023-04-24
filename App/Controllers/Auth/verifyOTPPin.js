const { OTPPin } = require("../../Utils/createOTP");
const jwt = require('jsonwebtoken');
const db = require("../../Models");
const users = db.Users;
const Sequelize = db.Sequelize;

module.exports.VerifyOTP = async (req, res) => {
    const { OTP, phone } = req.body
    if(!OTP) return res.status(400).json({ message: 'OTP is required.' });
    
    try{
        //check if token and email of a user exists
        const user = await users.findOne({
            where: {
                [Sequelize.Op.and]: [{
                        phone: phone
                    },
                    {
                        OTP_Pin: OTP
                    }
                ]
            }
        });

        if(!user){ 
            return res.status(404).json({ message: 'Invalid OTP'})
        }else{
            //Update the OTP with a new OTP to revoke the old token 
            await users.update({
                isLoogedIn: true,
                OTP_Pin: OTPPin() 
            }, {
                where: {
                    phone: user.dataValues.phone
                }
            });
            
            //Create a JWT token key for the user to receive in the frontend
            const accessToken = jwt.sign({ 
                    "id": user.dataValues.id
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '86400' }
            );

            return res.json({ phone: user.dataValues.phone, name: user.dataValues.firstname + " " + user.dataValues.lastname, token :accessToken });
        }
    }catch(e) {
        res.status(500).json({message: "Database error while trying to verify a user!" });
    }
}