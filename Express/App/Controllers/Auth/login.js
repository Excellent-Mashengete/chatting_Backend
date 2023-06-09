const bcrypt = require('bcrypt');
const db = require("../../Models");
const users = db.Users;
const Sequelize = db.Sequelize;
const { sendEmail } = require("../../Utils/email");

module.exports.login = async (req, res) => {
    const { identifier, password } = req.body
    if(!identifier || !password ) 
        return res.status(400).json({ error: 'email/Username and password are required.' });

    try{
        const user = await users.findOne({
            where:{ 
                [Sequelize.Op.or]: [{
                    phone: identifier
                    },
                    {
                        email: identifier
                    }
                ]
            }
        });

        //Check if user exists
        if (!user) {
            return res.status(400).json({ error: "user does not exists" })
        }
        else{
            bcrypt.compare(password, user.password, async (err, result) => {
                if(err) {
                    return res.status(400).json({ error: "Unable to compare hashed password" });
                } else if (result === true){ 
                    const header = "To verify your email address, please use the following One Time Password(OTP) \n";
                    const body = `Hi ${user.dataValues.firstname} ${user.dataValues.lastname} \n\n Your Chatting OTP PIN is: ${user.dataValues.OTP_Pin}`;
                    const footer = "\n Do not share this OTP with others";
                    const message = header +'\n' + body + '\n' + footer + '\n' + "\n Thank you!\nChatting Team";
                    
                    //send an email with an OTP PIN
                    await sendEmail(user.dataValues.email, "Verify your candidate account", message);
                    
                    return res.status(200).json({ message: "Check your emails for OTP PIN" });
                }else{
                    return res.status(400).json({ error: "Incorrect password" });
                }
            });
        }
    }catch(e) {
        res.status(500).json({error: "Database error while login a user!" });
    }
}
