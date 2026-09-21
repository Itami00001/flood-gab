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
    }
  });

  return Customer;
};
