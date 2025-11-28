// src/controllers/authController.js
const supabase = require('../db/supabaseClient');

// Register (sign up)
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    // data.user exists; if email confirmation required, session may be null
    return res.status(201).json({ ok: true, user: data.user, message: data.message || null });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'server error' });
  }
};

// Login (sign in)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: error.message });

    // data.session contains access_token, refresh_token, expires_at
    return res.json({ ok: true, user: data.user, session: data.session });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
