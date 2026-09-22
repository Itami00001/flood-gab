const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  define: { underscored: true },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.employee = require("./employee.model.js")(sequelize, Sequelize);
db.car = require("./car.model.js")(sequelize, Sequelize);
db.sale = require("./sale.model.js")(sequelize, Sequelize);
db.rental = require("./rental.model.js")(sequelize, Sequelize);
db.testDrive = require("./testdrive.model.js")(sequelize, Sequelize);
db.log = require("./log.model.js")(sequelize, Sequelize);

require("./references.model.js")(db);

module.exports = db;
