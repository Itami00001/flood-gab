const db = require("../models");
const Customer = db.customer;

exports.create = (req, res) => {
  if (!req.body.user_id || !req.body.phone) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const customer = {
    user_id: req.body.user_id,
    phone: req.body.phone,
    address: req.body.address,
    passport_data: req.body.passport_data
  };

  Customer.create(customer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Customer."
      });
    });
};

exports.findAll = (req, res) => {
  Customer.findAll({
    include: ["user"]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving customers."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id, {
    include: ["user"]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Customer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Customer with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Customer.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Customer was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Customer with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Customer was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Customer with id=" + id
      });
    });
};

exports.getSales = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id, {
    include: ["sales"]
  })
    .then(data => {
      if (data) {
        res.send(data.sales);
      } else {
        res.status(404).send({
          message: `Cannot find Customer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Customer sales with id=" + id
      });
    });
};

exports.getRentals = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id, {
    include: ["rentals"]
  })
    .then(data => {
      if (data) {
        res.send(data.rentals);
      } else {
        res.status(404).send({
          message: `Cannot find Customer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Customer rentals with id=" + id
      });
    });
};

exports.getTestDrives = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id, {
    include: ["test_drive_cars"]
  })
    .then(data => {
      if (data) {
        res.send(data.test_drive_cars);
      } else {
        res.status(404).send({
          message: `Cannot find Customer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Customer test drives with id=" + id
      });
    });
};
