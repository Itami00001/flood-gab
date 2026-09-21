module.exports = (db) => {
  // 1:1 — User ↔ Customer
  db.user.hasOne(db.customer, { foreignKey: 'user_id', as: 'customer', onDelete: 'CASCADE' });
  db.customer.belongsTo(db.user, { foreignKey: 'user_id', as: 'user' });

  // 1:1 — User ↔ Employee
  db.user.hasOne(db.employee, { foreignKey: 'user_id', as: 'employee', onDelete: 'CASCADE' });
  db.employee.belongsTo(db.user, { foreignKey: 'user_id', as: 'user' });

  // 1:N — Customer → Sale / Rental
  db.customer.hasMany(db.sale, { foreignKey: 'customer_id', as: 'sales', onDelete: 'CASCADE' });
  db.customer.hasMany(db.rental, { foreignKey: 'customer_id', as: 'rentals', onDelete: 'CASCADE' });
  db.sale.belongsTo(db.customer, { foreignKey: 'customer_id', as: 'customer' });
  db.rental.belongsTo(db.customer, { foreignKey: 'customer_id', as: 'customer' });

  // 1:N — Employee → Sale / Rental / TestDrive
  db.employee.hasMany(db.sale, { foreignKey: 'employee_id', as: 'sales' });
  db.employee.hasMany(db.rental, { foreignKey: 'employee_id', as: 'rentals' });
  db.employee.hasMany(db.testDrive, { foreignKey: 'employee_id', as: 'test_drives' });
  db.sale.belongsTo(db.employee, { foreignKey: 'employee_id', as: 'employee' });
  db.rental.belongsTo(db.employee, { foreignKey: 'employee_id', as: 'employee' });
  db.testDrive.belongsTo(db.employee, { foreignKey: 'employee_id', as: 'employee' });

  // 1:N — Car → Sale / Rental
  db.car.hasMany(db.sale, { foreignKey: 'car_id', as: 'sales' });
  db.car.hasMany(db.rental, { foreignKey: 'car_id', as: 'rentals' });
  db.sale.belongsTo(db.car, { foreignKey: 'car_id', as: 'car' });
  db.rental.belongsTo(db.car, { foreignKey: 'car_id', as: 'car' });

  // M:N — Customer ↔ Car через TestDrive
  db.customer.belongsToMany(db.car, {
    through: db.testDrive,
    foreignKey: 'customer_id',
    otherKey: 'car_id',
    as: 'test_drive_cars'
  });
  db.car.belongsToMany(db.customer, {
    through: db.testDrive,
    foreignKey: 'car_id',
    otherKey: 'customer_id',
    as: 'test_drive_customers'
  });
};
