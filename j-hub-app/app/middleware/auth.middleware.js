const db = require("../models");
const User = db.user;

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  User.findByPk(req.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User Not found."
        });
      }

      req.role = user.role;
      next();
    })
    .catch(err => {
      return res.status(500).send({
        message: "Unable to verify User"
      });
    });
};

exports.isAdmin = (req, res, next) => {
  if (req.role === 'admin') {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Admin Role!"
  });
};

exports.isManagerOrAdmin = (req, res, next) => {
  if (req.role === 'admin' || req.role === 'manager') {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Manager or Admin Role!"
  });
};
