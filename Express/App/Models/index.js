const dbConfig = require("../Configs/db.config");
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.storage
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./users.models")(sequelize, Sequelize);
db.Messages = require("./messages.models")(sequelize, Sequelize);

//Association model
//Messages
//Sender
db.Users.hasMany(db.Messages, {foreignKey: 'sender'});
db.Messages.belongsTo(db.Users, {foreignKey: 'sender'});

//Receiver
db.Users.hasMany(db.Messages, {foreignKey: 'receiver', as: 'receipient'});
db.Messages.belongsTo(db.Users, {foreignKey: 'receiver', as: 'receipient'});

module.exports = db;

