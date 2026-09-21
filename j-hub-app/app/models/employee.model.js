module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("employee", {
    user_id: {
      type: Sequelize.INTEGER,
      unique: true
    },
    position: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(20)
    },
    hire_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });

  return Employee;
};
