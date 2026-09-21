const db = require("../models");
const TestDrive = db.testDrive;

exports.create = (req, res) => {
  if (!req.body.customer_id || !req.body.car_id || !req.body.date) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const testDrive = {
    customer_id: req.body.customer_id,
    car_id: req.body.car_id,
    employee_id: req.body.employee_id,
    date: req.body.date,
    status: req.body.status || 'scheduled'
  };

  TestDrive.create(testDrive)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the TestDrive."
      });
    });
};

exports.findAll = (req, res) => {
  TestDrive.findAll({
    include: ["customer", "car", "employee"]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving test drives."
      });
    });
};

exports.findOne = (req, res) => {
  const { customer_id, car_id, date } = req.params;

  TestDrive.findOne({
    where: {
      customer_id: customer_id,
      car_id: car_id,
      date: date
    },
    include: ["customer", "car", "employee"]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find TestDrive with specified keys.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving TestDrive"
      });
    });
};

exports.update = (req, res) => {
  const { customer_id, car_id, date } = req.params;

  TestDrive.update(req.body, {
    where: {
      customer_id: customer_id,
      car_id: car_id,
      date: date
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "TestDrive was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update TestDrive. Maybe TestDrive was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating TestDrive"
      });
    });
};

exports.delete = (req, res) => {
  const { customer_id, car_id, date } = req.params;

  TestDrive.destroy({
    where: {
      customer_id: customer_id,
      car_id: car_id,
      date: date
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "TestDrive was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete TestDrive. Maybe TestDrive was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete TestDrive"
      });
    });
};

exports.updateStatus = (req, res) => {
  const { customer_id, car_id, date } = req.params;
  const { status } = req.body;

  TestDrive.update(
    { status: status },
    {
      where: {
        customer_id: customer_id,
        car_id: car_id,
        date: date
      }
    }
  )
    .then(num => {
      if (num == 1) {
        res.send({
          message: "TestDrive status was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update TestDrive status. Maybe TestDrive was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating TestDrive status"
      });
    });
};

exports.getSchedule = (req, res) => {
  const { date } = req.query;

  if (!date) {
    res.status(400).send({
      message: "Date parameter is required!"
    });
    return;
  }

  db.sequelize.query(
    `SELECT td.date, c.brand, c.model, u.full_name AS customer_name,
            e.position AS manager_position
     FROM test_drives td
     JOIN cars c ON td.car_id = c.id
     JOIN customers cu ON td.customer_id = cu.id
     JOIN users u ON cu.user_id = u.id
     LEFT JOIN employees e ON td.employee_id = e.id
     WHERE DATE(td.date) = :date
     ORDER BY td.date`,
    {
      replacements: { date },
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving test drive schedule"
      });
    });
};
