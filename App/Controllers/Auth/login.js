const bcrypt = require('bcrypt');
const db = require("../../Models");
const users = db.Users;
const Sequelize = db.Sequelize;
const { sendEmail } = require("../../Utils/email");

module.exports.login = async (req, res) => {
    const { identifier, password } = req.body
    if(!identifier || !password ) 
        return res.status(400).json({ message: 'email/Username and password are required.' });

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
        console.log(user);
        //Check if user exists
        if (!user) {
            return res.status(400).json({ message: "user does not exists" })
        }
        else{
            bcrypt.compare(password, user.password, async (err, result) => {
                if(err) {
                    return res.status(400).json({ message: "Unable to compare hashed password" });
                } else if (result === true){ 
                    const header = "To verify your email address, please use the following One Time Password(OTP) \n";
                    const body = `OTP PIN: ${user.dataValues.OTP_Pin}`;
                    const footer = "\n Do not share this OTP with others";
                    const message = header +'\n' + body + '\n' + footer + '\n' + "\n Thank you!";
                    
                    //send an email with an OTP PIN
                    await sendEmail(user.dataValues.email, "Verify your candidate account", message);
                        
                    return res.status(200).json({ message: "Check your emails for OTP PIN" });
                }else{
                    return res.status(400).json({ message: "Incorrect password" });
                }
            });
        }
    }catch(e) {
        res.status(500).json({message: "Database error while login a user!" });
    }
}
