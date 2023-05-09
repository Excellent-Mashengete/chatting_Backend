module.exports =  (sequelize, Sequelize) => {
    const Messages = sequelize.define("chat_messages", {
        messages: {
            type: Sequelize.TEXT
        },
        recipient_type: {
            type: Sequelize.ENUM("group, user"),
            defaultValue: "user",
        },
        read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        isFile: {
            type: Sequelize.BOOLEAN,
            default: false,
        },
        file: {
            type: Sequelize.TEXT,
            default: "",
        },
        delete:{
            type: Sequelize.BOOLEAN,
            default: false,
        } 
    });  
    return Messages;
  };
  