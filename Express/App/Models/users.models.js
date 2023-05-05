module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        firstname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email:{
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            unique: true,
        },
        avatar: {
            type: Sequelize.TEXT
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }, 
        OTP_Pin: {
            type: Sequelize.NUMBER,
            allowNull: false
        }, 
        isLoogedIn:{
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
  
    return Users;
};