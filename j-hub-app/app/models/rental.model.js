const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Rental = sequelize.define("rental", {
    car_id: {
      type: Sequelize.INTEGER
    },
    customer_id: {
      type: Sequelize.INTEGER
    },
    employee_id: {
      type: Sequelize.INTEGER
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total_price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'active'
    }
  });

  return Rental;
};
