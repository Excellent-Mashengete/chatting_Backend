const db = require("../../Models");
const users = db.Users;
const messages = db.Messages;
const Sequelize = db.Sequelize;

module.exports.getallchats = async (req, res) => {
    const id = req.userId;

    try{
    const contacts = await messages.findAll({
        where: {
            [Sequelize.Op.or]:[
                {sender: id},
                {receiver: id}  
            ],
        },
        attributes: [
            "messages", "read", "receiver", "sender",
            [Sequelize.literal(`(chat_messages.createdAt)`), 'datesend']
        ],
        include: [
            {
                model: users,
                attributes: ['id', 'firstname', 'phone', 'avatar']
            },
            {
                model: users, as: "receipient",
                attributes: ['id', 'firstname', 'phone', 'avatar']
            },
        ],

        order: [
            ['datesend', 'DESC'],
        ],

    });

    const userIds = contacts.filter((m) =>{
        m.dataValues.user.dataValues.id.toString() !== id
    }).map((m) =>{
        m.dataValues.user.dataValues.id
    }).concat(contacts.filter((m) =>
        m.dataValues.receipient.dataValues.id.toString() !== id
    ).map((m) => m.dataValues.receipient.dataValues.id
    )).concat(id);

    const user = await users.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: userIds
            }
        },
        attributes: ['id', 'firstname', 'phone', 'avatar']
    });

    const lastMessages = [];
    for (const chats of user) {
        const filteredMessages = contacts.filter((m) => (
                m.dataValues.user.dataValues.id === id &&
                m.dataValues.receipient.dataValues.id === chats.dataValues.id
            ) || ( 
                m.dataValues.user.dataValues.id === chats.dataValues.id &&
                m.dataValues.receipient.dataValues.id === id
            )
        );

        if (filteredMessages.length) {
            lastMessages.push({
                receiver: chats,
                lastMessage: filteredMessages[0],
                unreadcount: filteredMessages.filter((m => 
                    m.dataValues.read === false && m.dataValues.receiver === id
                )).length,
                filteredMessages: filteredMessages,
            });
        }
    }



    return res.status(200).json({ message: "Successfully queried all users", chats: lastMessages });
    } catch(e) {
        return res.status(500).json({ error: "Database error while retrieving all chats" });
    }
}

