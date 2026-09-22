const db = require("../models");
const User = db.user;
const Customer = db.customer;
const bcrypt = require("bcryptjs");

exports.create = (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const password_hash = bcrypt.hashSync(req.body.password, 10);

  const user = {
    username: req.body.username,
    password_hash: password_hash,
    email: req.body.email,
    full_name: req.body.full_name || req.body.username,
    role: req.body.role || 'client'
  };

  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
      });
    });
};

// FIX-13: Register creates User + Customer with balance 7000000, проверено 2026-09-22
exports.register = async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.full_name || !req.body.phone) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  const password_hash = bcrypt.hashSync(req.body.password, 10);

  const user = {
    username: req.body.username,
    password_hash: password_hash,
    email: req.body.email,
    full_name: req.body.full_name,
    role: 'client'
  };

  try {
    const createdUser = await User.create(user);
    
    // Create associated Customer with default balance
    await Customer.create({
      user_id: createdUser.id,
      phone: req.body.phone,
      address: '',
      passport_data: '',
      balance: 7000000
    });

    res.status(201).send({
      message: "User registered successfully",
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      full_name: createdUser.full_name,
      role: createdUser.role
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while registering the User."
    });
  }
};

exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// FIX-8: Ответ логина включает role, customer_id, balance, проверено 2026-09-21
exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: { username: username },
    include: [{
      model: Customer,
      as: 'customer'
    }]
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password_hash);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      res.send({
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        customer_id: user.customer ? user.customer.id : null,
        balance: user.customer ? user.customer.balance : 0
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error during login"
      });
    });
};

exports.topSpenders = (req, res) => {
  const limit = req.query.limit || 10;

  db.sequelize.query(
    `SELECT u.id, u.username, u.full_name,
            SUM(s.total_price) AS total_spent,
            COUNT(s.id) AS sales_count
     FROM users u
     JOIN customers c ON u.id = c.user_id
     JOIN sales s ON c.id = s.customer_id
     WHERE s.status = 'completed'
     GROUP BY u.id, u.username, u.full_name
     ORDER BY total_spent DESC
     LIMIT :limit`,
    {
      replacements: { limit: parseInt(limit) },
      type: db.sequelize.QueryTypes.SELECT
    }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving top spenders"
      });
    });
};
