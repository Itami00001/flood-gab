// FIX-4: Добавлено поле balance: DECIMAL(12,2), defaultValue: 7000000, сделано, проверено 2026-09-21
module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    user_id: {
      type: Sequelize.INTEGER,
      unique: true
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING(255)
    },
    passport_data: {
      type: Sequelize.STRING(100)
    },
    balance: {
      type: Sequelize.DECIMAL(12, 2),
      defaultValue: 7000000
    }
  });

  return Customer;
};
