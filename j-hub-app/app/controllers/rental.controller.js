const db = require("../models");
const Rental = db.rental;
const Car = db.car;

// FIX-9: Query-параметры и обновление статуса авто, проверено 2026-09-21
exports.create = (req, res) => {
  if (!req.body.car_id || !req.body.customer_id || !req.body.employee_id || !req.body.start_date || !req.body.end_date || !req.body.total_price) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const rental = {
    car_id: req.body.car_id,
    customer_id: req.body.customer_id,
    employee_id: req.body.employee_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    total_price: req.body.total_price,
    status: req.body.status || 'active'
  };

  Rental.create(rental)
    .then(async (data) => {
      // Обновить статус авто на rented
      await Car.update(
        { status: 'rented' },
        { where: { id: req.body.car_id } }
      );
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Rental."
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

  Rental.findAll({
    where,
    include: ["car", "customer", "employee"]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rentals."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Rental.findByPk(id, {
    include: ["car", "customer", "employee"]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Rental with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Rental with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Rental.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rental was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Rental with id=${id}. Maybe Rental was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Rental with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Rental.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Rental was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Rental with id=${id}. Maybe Rental was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Rental with id=" + id
      });
    });
};

exports.returnCar = (req, res) => {
  const id = req.params.id;

  Rental.update(
    { status: 'completed' },
    { where: { id: id } }
  )
    .then(async (num) => {
      if (num == 1) {
        const rental = await Rental.findByPk(id);
        if (rental) {
          // Вернуть статус авто на available
          await Car.update(
            { status: 'available' },
            { where: { id: rental.car_id } }
          );
        }
        res.send({
          message: "Rental was completed successfully."
        });
      } else {
        res.send({
          message: `Cannot complete Rental with id=${id}. Maybe Rental was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error completing Rental with id=" + id
      });
    });
};

exports.getAvailable = (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    res.status(400).send({
      message: "Start and end dates are required!"
    });
    return;
  }

  db.sequelize.query(
    `SELECT c.* FROM cars c
     WHERE c.status = 'available'
       AND c.id NOT IN (
         SELECT car_id FROM rentals
         WHERE (start_date, end_date) OVERLAPS (:start::date, :end::date)
           AND status = 'active'
       )
     ORDER BY c.price`,
    {
      replacements: { start, end },
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving available cars"
      });
    });
};
