/**
 * @swagger
 * /api/cars/:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articul:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               mileage:
 *                 type: integer
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *               equipment:
 *                 type: string
 *               photo_url:
 *                 type: string
 *               vin:
 *                 type: string
 *             example:
 *               articul: "TOY003"
 *               brand: "Toyota"
 *               model: "Corolla"
 *               year: 2024
 *               color: "Blue"
 *               mileage: 0
 *               price: 2000000
 *               status: "available"
 *               equipment: "Standard"
 *               photo_url: ""
 *               vin: "JTDKB20U5A0000002"
 *     responses:
 *       201:
 *         description: Car created successfully
 */
/**
 * @swagger
 * /api/cars/:
 *   get:
 *     summary: Get all cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of cars
 */
/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car found
 */
/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Car updated successfully
 */
/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car deleted successfully
 */
/**
 * @swagger
 * /api/cars/{id}/details:
 *   get:
 *     summary: Get car details with sales history
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Car details found
 */

module.exports = app => {
  const car = require("../controllers/car.controller.js");

  var router = require("express").Router();

  router.post("/", car.create);

  router.get("/", car.findAll);

  router.get("/:id", car.findOne);

  router.put("/:id", car.update);

  router.delete("/:id", car.delete);

  router.get("/:id/details", car.getDetails);

  app.use('/api/cars', router);
};
