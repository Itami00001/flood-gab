const db = require("../models");

exports.getUserBalances = (req, res) => {
  db.sequelize.query(
    `SELECT u.id, u.username, u.full_name, u.role,
            COALESCE(SUM(s.total_price), 0) AS total_spent,
            COUNT(DISTINCT s.id) AS sales_count
     FROM users u
     LEFT JOIN customers c ON u.id = c.user_id
     LEFT JOIN sales s ON c.id = s.customer_id AND s.status = 'completed'
     GROUP BY u.id, u.username, u.full_name, u.role
     ORDER BY total_spent DESC`,
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving user balances"
      });
    });
};

exports.getCarStats = (req, res) => {
  db.sequelize.query(
    `SELECT c.id, c.brand, c.model, c.status, c.price,
            COUNT(DISTINCT s.id) AS sales_count,
            COUNT(DISTINCT r.id) AS rentals_count,
            COUNT(DISTINCT td.customer_id) AS test_drive_count
     FROM cars c
     LEFT JOIN sales s ON c.id = s.car_id
     LEFT JOIN rentals r ON c.id = r.car_id
     LEFT JOIN test_drives td ON c.id = td.car_id
     GROUP BY c.id, c.brand, c.model, c.status, c.price
     ORDER BY sales_count DESC`,
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving car statistics"
      });
    });
};

exports.getOverview = (req, res) => {
  db.sequelize.query(
    `SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM cars) AS total_cars,
            (SELECT COUNT(*) FROM sales WHERE status = 'completed') AS completed_sales,
            (SELECT COUNT(*) FROM rentals WHERE status = 'completed') AS completed_rentals,
            (SELECT COUNT(*) FROM test_drives WHERE status = 'done') AS completed_test_drives,
            (SELECT COALESCE(SUM(total_price), 0) FROM sales WHERE status = 'completed') AS total_revenue`,
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving overview statistics"
      });
    });
};

exports.getPopularTestDrives = (req, res) => {
  db.sequelize.query(
    `SELECT c.id, c.brand, c.model, COUNT(td.customer_id) AS test_drive_count
     FROM cars c
     LEFT JOIN test_drives td ON c.id = td.car_id
     GROUP BY c.id, c.brand, c.model
     ORDER BY test_drive_count DESC
     LIMIT 5`,
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving popular test drives"
      });
    });
};

exports.getEmployeePerformance = (req, res) => {
  db.sequelize.query(
    `SELECT e.id, u.full_name, e.position,
            COUNT(DISTINCT s.id) AS sales_count,
            COUNT(DISTINCT r.id) AS rentals_count,
            COALESCE(SUM(s.total_price), 0) AS total_revenue
     FROM employees e
     JOIN users u ON e.user_id = u.id
     LEFT JOIN sales s ON e.id = s.employee_id AND s.status = 'completed'
     LEFT JOIN rentals r ON e.id = r.employee_id AND r.status = 'completed'
     GROUP BY e.id, u.full_name, e.position
     ORDER BY total_revenue DESC`,
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving employee performance"
      });
    });
};
