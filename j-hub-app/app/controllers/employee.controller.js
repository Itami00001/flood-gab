const db = require("../models");
const Employee = db.employee;

exports.create = (req, res) => {
  if (!req.body.user_id || !req.body.position) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const employee = {
    user_id: req.body.user_id,
    position: req.body.position,
    phone: req.body.phone,
    hire_date: req.body.hire_date
  };

  Employee.create(employee)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Employee."
      });
    });
};

exports.findAll = (req, res) => {
  Employee.findAll({
    include: ["user"]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving employees."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Employee.findByPk(id, {
    include: ["user"]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Employee with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Employee with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Employee.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Employee was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Employee with id=${id}. Maybe Employee was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Employee with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Employee.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Employee was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Employee with id=${id}. Maybe Employee was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Employee with id=" + id
      });
    });
};

exports.getSales = (req, res) => {
  const id = req.params.id;

  Employee.findByPk(id, {
    include: ["sales"]
  })
    .then(data => {
      if (data) {
        res.send(data.sales);
      } else {
        res.status(404).send({
          message: `Cannot find Employee with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Employee sales with id=" + id
      });
    });
};
