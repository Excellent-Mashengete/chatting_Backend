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

module.exports = db;

