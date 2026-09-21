const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sale", {
    car_id: {
      type: Sequelize.INTEGER
    },
    customer_id: {
      type: Sequelize.INTEGER
    },
    employee_id: {
      type: Sequelize.INTEGER
    },
    sale_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    total_price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    payment_method: {
      type: Sequelize.STRING(30)
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'pending'
    }
  });

  return Sale;
};
