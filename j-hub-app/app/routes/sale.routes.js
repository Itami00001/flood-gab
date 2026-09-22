/**
 * @swagger
 * /api/sales/:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
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
 *               total_price:
 *                 type: number
 *               payment_method:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               car_id: 1
 *               customer_id: 1
 *               employee_id: 1
 *               total_price: 2500000
 *               payment_method: "card"
 *               status: "pending"
 *     responses:
 *       201:
 *         description: Sale created successfully
 */
/**
 * @swagger
 * /api/sales/:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: List of sales
 */
/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale found
 */
/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update sale
 *     tags: [Sales]
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
 *         description: Sale updated successfully
 */
/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete sale
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 */
/**
 * @swagger
 * /api/sales/{id}/complete:
 *   put:
 *     summary: Complete sale
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale completed successfully
 */
/**
 * @swagger
 * /api/sales/statistics/sales:
 *   get:
 *     summary: Get sales statistics by month
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Sales statistics
 */

module.exports = app => {
  const sale = require("../controllers/sale.controller.js");

  var router = require("express").Router();

  router.post("/", sale.create);

  router.get("/", sale.findAll);

  router.get("/:id", sale.findOne);

  router.put("/:id", sale.update);

  router.delete("/:id", sale.delete);

  router.put("/:id/complete", sale.complete);

  router.get("/statistics/sales", sale.getStatistics);

  app.use('/api/sales', router);
};
