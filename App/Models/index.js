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
db.Token = require("./token.models")(sequelize, Sequelize);

db.Token.belongsTo(db.Users, {foreignKey: 'user_id'});

module.exports = db;

