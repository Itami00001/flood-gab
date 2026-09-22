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
/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get system logs
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [info, warn, error]
 *         description: Filter by log level
 *     responses:
 *       200:
 *         description: List of logs
 */

module.exports = app => {
  const admin = require("../controllers/admin.controller.js");

  var router = require("express").Router();

  router.get("/users/balances", admin.getUserBalances);

  router.get("/cars/stats", admin.getCarStats);

  router.get("/statistics/overview", admin.getOverview);

  router.get("/testdrives/popular", admin.getPopularTestDrives);

  router.get("/employees/performance", admin.getEmployeePerformance);

  router.put("/users/:id/topup", admin.topupUserBalance);

  // FIX-12: Маршрут для получения логов, проверено 2026-09-21
  router.get("/logs", admin.getLogs);

  app.use('/api/admin', router);
};
