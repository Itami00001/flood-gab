module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define("car", {
    articul: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
    },
    brand: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    model: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    color: {
      type: Sequelize.STRING(30)
    },
    mileage: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: 'available'
    },
    equipment: {
      type: Sequelize.TEXT
    },
    photo_url: {
      type: Sequelize.STRING(255)
    },
    vin: {
      type: Sequelize.STRING(17),
      unique: true
    }
  });

  return Car;
};
