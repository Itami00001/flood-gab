/**
 * @swagger
 * /api/admin/users/balances:
 *   get:
 *     summary: Get users with balances
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users with balances
 */
/**
 * @swagger
 * /api/admin/cars/stats:
 *   get:
 *     summary: Get cars statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Cars statistics
 */
/**
 * @swagger
 * /api/admin/statistics/overview:
 *   get:
 *     summary: Get overview statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Overview statistics
 */
/**
 * @swagger
 * /api/admin/testdrives/popular:
 *   get:
 *     summary: Get popular test drives
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Popular test drives
 */
/**
 * @swagger
 * /api/admin/employees/performance:
 *   get:
 *     summary: Get employee performance
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Employee performance
 */

module.exports = app => {
  const admin = require("../controllers/admin.controller.js");

  var router = require("express").Router();

  router.get("/users/balances", admin.getUserBalances);

  router.get("/cars/stats", admin.getCarStats);

  router.get("/statistics/overview", admin.getOverview);

  router.get("/testdrives/popular", admin.getPopularTestDrives);

  router.get("/employees/performance", admin.getEmployeePerformance);

  app.use('/api/admin', router);
};
