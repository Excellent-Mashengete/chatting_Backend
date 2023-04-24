const { sendEmail } = require("../../Utils/email");
const db = require("../../Models");
const users = db.Users;

module.exports.RequestOTP_PIN = async (req, res) => {
    const { phone } = req.body;
    try {
        //check if email of a user exists
        const user = await users.findOne({
            where: {
                phone: phone
            }
        });

        const header = "To verify your email address, please use the following One Time Password(OTP) \n";
        const body = `OTP PIN: ${user.dataValues.OTP_Pin}`;
        const footer = "\n Do not share this OTP with others";
        const message = header +'\n' + body + '\n' + footer + '\n' + "\n Thank you!";

        //send an email with an OTP PIN
        await sendEmail(user.dataValues.email, "Verify your candidate account", message);

        return res.status(200).json({ message: "Check your emails for OTP PIN" });
    }catch(e) {
        res.status(500).json({message: "Database error while requesting a new OTP PIN user!" });
    }
}