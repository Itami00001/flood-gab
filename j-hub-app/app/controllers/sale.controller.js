const db = require("../models");
const Sale = db.sale;
const Car = db.car;

// FIX-9: Query-параметры и обновление статуса авто, проверено 2026-09-21
exports.create = (req, res) => {
  if (!req.body.car_id || !req.body.customer_id || !req.body.employee_id || !req.body.total_price) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const sale = {
    car_id: req.body.car_id,
    customer_id: req.body.customer_id,
    employee_id: req.body.employee_id,
    sale_date: req.body.sale_date,
    total_price: req.body.total_price,
    payment_method: req.body.payment_method,
    status: req.body.status || 'pending'
  };

  Sale.create(sale)
    .then(async (data) => {
      // Обновить статус авто на sold
      await Car.update(
        { status: 'sold' },
        { where: { id: req.body.car_id } }
      );
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Sale."
      });
    });
};

exports.findAll = (req, res) => {
  const { customer_id, employee_id, car_id, status } = req.query;
  const where = {};
  
  if (customer_id) where.customer_id = customer_id;
  if (employee_id) where.employee_id = employee_id;
  if (car_id) where.car_id = car_id;
  if (status) where.status = status;

  Sale.findAll({
    where,
    include: ["car", "customer", "employee"]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving sales."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Sale.findByPk(id, {
    include: ["car", "customer", "employee"]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Sale with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Sale with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Sale.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Sale was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Sale with id=${id}. Maybe Sale was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Sale with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Sale.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Sale was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Sale with id=${id}. Maybe Sale was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Sale with id=" + id
      });
    });
};

exports.complete = (req, res) => {
  const id = req.params.id;

  Sale.update(
    { status: 'completed' },
    { where: { id: id } }
  )
    .then(async (num) => {
      if (num == 1) {
        const sale = await Sale.findByPk(id);
        if (sale) {
          await Car.update(
            { status: 'sold' },
            { where: { id: sale.car_id } }
          );
        }
        res.send({
          message: "Sale was completed successfully."
        });
      } else {
        res.send({
          message: `Cannot complete Sale with id=${id}. Maybe Sale was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error completing Sale with id=" + id
      });
    });
};

exports.getStatistics = (req, res) => {
  db.sequelize.query(
    `SELECT TO_CHAR(sale_date, 'YYYY-MM') AS period,
            COUNT(*) AS sales_count,
            SUM(total_price) AS revenue
     FROM sales
     WHERE status = 'completed'
     GROUP BY period
     ORDER BY period DESC`,
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving sales statistics"
      });
    });
};
