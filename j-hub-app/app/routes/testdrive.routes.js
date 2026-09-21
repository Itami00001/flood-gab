/**
 * @swagger
 * /api/testdrives/:
 *   post:
 *     summary: Create a new test drive
 *     tags: [TestDrives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               car_id:
 *                 type: integer
 *               employee_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Test drive created successfully
 */
/**
 * @swagger
 * /api/testdrives/:
 *   get:
 *     summary: Get all test drives
 *     tags: [TestDrives]
 *     responses:
 *       200:
 *         description: List of test drives
 */
/**
 * @swagger
 * /api/testdrives/schedule:
 *   get:
 *     summary: Get test drive schedule for date
 *     tags: [TestDrives]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Test drive schedule
 */
/**
 * @swagger
 * /api/testdrives/{customer_id}/{car_id}/{date}:
 *   get:
 *     summary: Get test drive by composite key
 *     tags: [TestDrives]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: car_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Test drive found
 */
/**
 * @swagger
 * /api/testdrives/{customer_id}/{car_id}/{date}:
 *   put:
 *     summary: Update test drive
 *     tags: [TestDrives]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: car_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Test drive updated successfully
 */
/**
 * @swagger
 * /api/testdrives/{customer_id}/{car_id}/{date}:
 *   delete:
 *     summary: Delete test drive
 *     tags: [TestDrives]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: car_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Test drive deleted successfully
 */
/**
 * @swagger
 * /api/testdrives/{customer_id}/{car_id}/{date}/status:
 *   put:
 *     summary: Update test drive status
 *     tags: [TestDrives]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: car_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test drive status updated successfully
 */

module.exports = app => {
  const testdrive = require("../controllers/testdrive.controller.js");

  var router = require("express").Router();

  router.post("/", testdrive.create);

  router.get("/", testdrive.findAll);

  router.get("/schedule", testdrive.getSchedule);

  router.get("/:customer_id/:car_id/:date", testdrive.findOne);

  router.put("/:customer_id/:car_id/:date", testdrive.update);

  router.delete("/:customer_id/:car_id/:date", testdrive.delete);

  router.put("/:customer_id/:car_id/:date/status", testdrive.updateStatus);

  app.use('/api/testdrives', router);
};
