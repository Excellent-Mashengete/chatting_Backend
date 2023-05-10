const db = require("../../Models");
const messages = db.Messages;
const Sequelize = db.Sequelize;

module.exports.getmessages = async (req, res) => {
    const sender = req.userId;
    const { receiver} = req.params;
    try {  
        const mess = await await messages.findAll({ 
            where : {
                [Sequelize.Op.or]: [{
                        sender: sender,
                        receiver: receiver
                    },
                    {
                        sender: receiver,
                        receiver: sender
                    }
                ]
            }
        });

        return res.status(200).json({ messages:"Successfully got all messages" , results: mess });
    
    }catch(e) {
        res.status(500).json({message: "Database error while retrieving one-on-one messages" });
    }
}