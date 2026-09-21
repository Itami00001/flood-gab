const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const TestDrive = sequelize.define("test_drive", {
    customer_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    car_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    employee_id: {
      type: Sequelize.INTEGER
    },
    date: {
      type: DataTypes.DATE,
      primaryKey: true,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'scheduled'
    }
  });

  return TestDrive;
};
