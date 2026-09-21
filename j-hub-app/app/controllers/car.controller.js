const db = require("../models");
const Car = db.car;
const { Op } = db.Sequelize;

exports.create = (req, res) => {
  if (!req.body.articul || !req.body.brand || !req.body.model || !req.body.year || !req.body.price) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const car = {
    articul: req.body.articul,
    brand: req.body.brand,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color,
    mileage: req.body.mileage || 0,
    price: req.body.price,
    status: req.body.status || 'available',
    equipment: req.body.equipment,
    photo_url: req.body.photo_url,
    vin: req.body.vin
  };

  Car.create(car)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Car."
      });
    });
};

exports.findAll = (req, res) => {
  const { brand, status, min_price, max_price } = req.query;

  const condition = {};
  if (brand) condition.brand = { [Op.like]: `%${brand}%` };
  if (status) condition.status = status;
  if (min_price || max_price) {
    condition.price = {};
    if (min_price) condition.price[Op.gte] = min_price;
    if (max_price) condition.price[Op.lte] = max_price;
  }

  Car.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving cars."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Car.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Car with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Car with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Car.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Car was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Car with id=${id}. Maybe Car was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Car with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Car.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Car was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Car with id=${id}. Maybe Car was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Car with id=" + id
      });
    });
};

exports.getDetails = (req, res) => {
  const id = req.params.id;

  db.sequelize.query(
    `SELECT c.*,
            s.sale_date, s.total_price AS sale_price,
            cu.phone AS buyer_phone,
            u.full_name AS buyer_name
     FROM cars c
     LEFT JOIN sales s ON c.id = s.car_id
     LEFT JOIN customers cu ON s.customer_id = cu.id
     LEFT JOIN users u ON cu.user_id = u.id
     WHERE c.id = :id
     ORDER BY s.sale_date DESC
     LIMIT 1`,
    {
      replacements: { id: parseInt(id) },
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      if (data && data.length > 0) {
        res.send(data[0]);
      } else {
        res.status(404).send({
          message: `Cannot find Car with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Car details with id=" + id
      });
    });
};
