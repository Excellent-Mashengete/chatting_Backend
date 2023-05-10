const db = require("../../Models");
const users = db.Users;
const messages = db.Messages;
const Sequelize = db.Sequelize;

module.exports.getallchats = async (req, res) => {
    const id = req.userId;

    try{
        //get all user you are chatting to
        const contacts = await messages.findAll({
            where: { 
                [Sequelize.Op.or]: [
                    {sender: id},
                    {receiver: id},
                ],
              
            },
            include: { 
                model: users,
                    attributes:[
                    'id', 'firstname', 'lastname','email',
                    'phone','avatar'
                ]
            },

            group:[
                'chat_messages.id'
            ],

            order:[
                ['createdAt', 'DESC'],
                [ Sequelize.fn('min', Sequelize.col('chat_messages.createdAt')),'DESC']    
            ], 
        });
    
        return res.status(200).json({ messages: "Successfully queried all users", allContact: contacts});
    } catch(e) {
        return res.status(500).json({ error: "Database error while retrieving all chats" });
    }
}

