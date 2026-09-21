/**
 * @swagger
 * /api/rentals/:
 *   post:
 *     summary: Create a new rental
 *     tags: [Rentals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               car_id:
 *                 type: integer
 *               customer_id:
 *                 type: integer
 *               employee_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               total_price:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rental created successfully
 */
/**
 * @swagger
 * /api/rentals/:
 *   get:
 *     summary: Get all rentals
 *     tags: [Rentals]
 *     responses:
 *       200:
 *         description: List of rentals
 */
/**
 * @swagger
 * /api/rentals/{id}:
 *   get:
 *     summary: Get rental by ID
 *     tags: [Rentals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rental found
 */
/**
 * @swagger
 * /api/rentals/{id}:
 *   put:
 *     summary: Update rental
 *     tags: [Rentals]
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
 *         description: Rental updated successfully
 */
/**
 * @swagger
 * /api/rentals/{id}:
 *   delete:
 *     summary: Delete rental
 *     tags: [Rentals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rental deleted successfully
 */
/**
 * @swagger
 * /api/rentals/{id}/return:
 *   put:
 *     summary: Return rental car
 *     tags: [Rentals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rental completed successfully
 */
/**
 * @swagger
 * /api/rentals/available:
 *   get:
 *     summary: Get available cars for rental period
 *     tags: [Rentals]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of available cars
 */

module.exports = app => {
  const rental = require("../controllers/rental.controller.js");

  var router = require("express").Router();

  router.post("/", rental.create);

  router.get("/", rental.findAll);

  router.get("/:id", rental.findOne);

  router.put("/:id", rental.update);

  router.delete("/:id", rental.delete);

  router.put("/:id/return", rental.returnCar);

  router.get("/available", rental.getAvailable);

  app.use('/api/rentals', router);
};
