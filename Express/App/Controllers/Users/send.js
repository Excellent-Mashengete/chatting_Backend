const db = require("../../Models");
const users = db.Users;
const messages = db.Messages;

module.exports.sendmessages = async (req, res) => {
    const sender = req.userId;
    const { receiver, text, recipient_type, isFile, delmessage} = req.body;
    try {
        if(recipient_type === "user") {
            const user = await await users.findOne({ where: { id: sender } });
            const otherUser  = await await users.findOne({ where: { id: receiver } });

            if (user === null && otherUser === null) {
                return res.status(400).json({ error: "user does not exist" });
            }else{
                await messages.create({
                    messages:text, recipient_type:recipient_type, isFile:isFile, 
                    delete:delmessage, sender:sender, receiver:receiver
                });

                return res.status(200).json({message: `message send to, ${receiver}` });
            }
        }

    }catch(e) {
        res.status(500).json({message: "Database error while sending a message to a user!" });
    }
}