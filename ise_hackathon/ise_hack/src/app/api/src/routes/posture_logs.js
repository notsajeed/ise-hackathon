// src/routes/posture_logs.js
const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');
const auth = require('../middleware/auth');

router.use(auth);

// POST /api/logs
router.post('/', logsController.createLog);

// GET /api/logs?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', logsController.getLogs);

// GET /api/logs/summary?days=7
router.get('/summary', logsController.getSummary);

module.exports = router;
