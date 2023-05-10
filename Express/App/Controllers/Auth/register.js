const { OTPPin } = require("../../Utils/createOTP");
const db = require("../../Models");
const { sendEmail } = require("../../Utils/email");
const bcrypt = require('bcrypt');
const users = db.Users;

//Register a new user
module.exports.register = async (req, res) => {
    const { firstname,  lastname, email, phone, password } = req.body;
    const avatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';
    try { 
        const user = await users.findOne({
            where:{ 
                [Sequelize.Op.or]: [{
                        phone: phone
                    },
                    {
                        email: email
                    }
                ]
            }
        });
        if(user){
            return res.status(400).json({ error: "Failed! phone or email already in use!" })
        } else{
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) return res.status(400).json({ error: "unable to protect password" });
                
                await users.create({
                    firstname: firstname, lastname: lastname,
                    email:email, phone:phone,
                    OTP_Pin:OTPPin(), avatar: avatar, password: hash
                });

                const header = "To verify your email address, please use the following One Time Password(OTP) \n";
                const body = `Hi ${user.dataValues.firstname} ${user.dataValues.lastname} \n\n Your Chatting OTP PIN is: ${user.dataValues.OTP_Pin}`;
                const footer = "\n Do not share this OTP with others";
                const message = header +'\n' + body + '\n' + footer + '\n' + "\n Thank you!\nChatting Team";
                
                //send an email with an OTP PIN
                await sendEmail(user.dataValues.email, "Verify your candidate account", message);
                
                return res.status(200).json({ message: "successfully registered, Check your emails for OTP PIN" });

            })
        }
    }catch(e) {
        res.status(500).json({message: "Database error while registring user!" });
    }
}
