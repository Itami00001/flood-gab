/**
 * @swagger
 * /api/customers/:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               passport_data:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 */
/**
 * @swagger
 * /api/customers/:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of customers
 */
/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer found
 */
/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer
 *     tags: [Customers]
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
 *         description: Customer updated successfully
 */
/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 */
/**
 * @swagger
 * /api/customers/{id}/sales:
 *   get:
 *     summary: Get customer sales
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of customer sales
 */
/**
 * @swagger
 * /api/customers/{id}/rentals:
 *   get:
 *     summary: Get customer rentals
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of customer rentals
 */
/**
 * @swagger
 * /api/customers/{id}/testdrives:
 *   get:
 *     summary: Get customer test drives
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of customer test drives
 */

module.exports = app => {
  const customer = require("../controllers/customer.controller.js");

  var router = require("express").Router();

  router.post("/", customer.create);

  router.get("/", customer.findAll);

  router.get("/:id", customer.findOne);

  router.put("/:id", customer.update);

  router.delete("/:id", customer.delete);

  router.get("/:id/sales", customer.getSales);

  router.get("/:id/rentals", customer.getRentals);

  router.get("/:id/testdrives", customer.getTestDrives);

  app.use('/api/customers', router);
};
