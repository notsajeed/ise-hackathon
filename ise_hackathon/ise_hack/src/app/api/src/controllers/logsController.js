// src/controllers/logsController.js
const LogService = require('../services/LogService');

exports.createLog = async (req, res) => {
  try {
    // expected body: { posture, confidence, durationSeconds, timestamp, note }
    const payload = req.body;
    payload.userId = req.user ? req.user.id : null;
    const log = await LogService.create(payload);
    return res.status(201).json({ ok: true, log });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to save log' });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { from, to } = req.query;
    const userId = req.user ? req.user.id : null;
    const logs = await LogService.get({ from, to, userId });
    return res.json({ ok: true, logs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to fetch logs' });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const userId = req.user ? req.user.id : null;
    const summary = await LogService.summary({ days, userId });
    return res.json({ ok: true, summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to fetch summary' });
  }
};
