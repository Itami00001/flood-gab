require('dotenv').config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const loggerMiddleware = require("./app/middleware/logger.middleware.js");

const app = express();

var corsOptions = {
  origin: ["http://localhost:6868", "http://localhost:3000"]
};

app.use(cors(corsOptions));

// FIX-13: Helmet with connect-src for CSP, игнорируем /.well-known/..., проверено 2026-09-22
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:6868", "ws://localhost:6868"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ignore /.well-known/ requests
app.use('/.well-known', (req, res) => res.status(204).end());

// FIX-12: Middleware логирования мутирующих операций, проверено 2026-09-21
app.use('/api', loggerMiddleware);

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'J Hub API',
      version: '1.0.0',
      description: 'API для автосалона J Hub - продажа, аренда и тест-драйв автомобилей'
    },
    servers: [
      {
        url: 'http://localhost:6868',
        description: 'Development server'
      }
    ]
  },
  apis: ['./app/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to J Hub application." });
});

// Routes
require("./app/routes/user.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/car.routes")(app);
require("./app/routes/sale.routes")(app);
require("./app/routes/rental.routes")(app);
require("./app/routes/testdrive.routes")(app);
require("./app/routes/admin.routes")(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
