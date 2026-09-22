// FIX-12: Служебная таблица Log (не входит в 7 сущностей), проверено 2026-09-21
module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("log", {
    level: {
      type: Sequelize.ENUM('info', 'warn', 'error'),
      allowNull: false
    },
    action: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    entity: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    entity_id: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.TEXT
    }
  });

  return Log;
};
