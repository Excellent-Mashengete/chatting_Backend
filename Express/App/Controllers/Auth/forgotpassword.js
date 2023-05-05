const { sendEmail } = require("../../Utils/email");
const { OTPPin } = require("../../Utils/createOTP");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("../../Models");
const users = db.Users;
const Sequelize = db.Sequelize;

module.exports.PasswordReset = async (req, res) => {
    const { identifier } = req.body;

    if(!identifier) return res.status(400).json({ error: 'identifier is required.' });


    try{
        //check if OTP and email of a user exists
        const user = await users.findOne({
            where: {
                [Sequelize.Op.or]: [{
                        email: identifier
                    },
                    {
                        phone: identifier
                    }
                ]
            }
        });

        if(!user){ 
            return res.status(404).json({ error: 'user not found' });
        }else{
            
            const header = "To verify your email address, please use the following One Time Password(OTP) \n";
            const body = `OTP PIN: ${user.dataValues.OTP_Pin}`;
            const footer = "\n Do not share this OTP with others";
            const message = header +'\n' + body + '\n' + footer + '\n' + "\n Thank you!";
    
            //send an email with an OTP PIN
            await sendEmail(user.dataValues.email, "Reset email ONE-TIME OTP", message);
    
            return res.status(200).json({ message: "Check your emails for OTP PIN" });
        }
    }catch(e) {
        res.status(500).json({error: "Database error while processing a forgot password!" });
    }
}

module.exports.VerifyResetEmail = async (req, res) => {
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
                OTP_Pin: OTPPin()
            }, {
                where: {
                    email: user.dataValues.email
                }
            });
            return res.status(200).json({ message: 'OTP PIN verified successfully!'});
        }
    }catch(e) {
        res.status(500).json({error: "Database error while verifying reset email request!" });
    }
}


module.exports.CreateNewPassword = async (req, res) => {
    const { identifier, newpassword } = req.body;

    try {
        //check if user exists
        const user = await users.findOne({
            where: {
                [Sequelize.Op.or]: [{
                        email: identifier
                    },
                    {
                        phone: identifier
                    }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ error: "user does not exists" })
        }
        else{
            bcrypt.hash(newpassword, 10, async (err, hash) => {
                if (err) return res.status(400).json({ error: "unable to protect password" });

                //Update the Password and isLoogedIn  
                await users.update({
                    isLoogedIn: true,
                    password: hash 
                }, {
                    where: {
                        [Sequelize.Op.or]: [{
                                email: identifier
                            },
                            {
                                phone: identifier
                            }
                        ]
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
            });
        }
    }catch(e) {
        res.status(500).json({error: "Database error while create a new password!" });
    }
}

