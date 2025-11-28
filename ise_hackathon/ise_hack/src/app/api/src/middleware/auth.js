// src/middleware/auth.js
const supabase = require('../db/supabaseClient');

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) { req.user = null; return next(); }
  const parts = auth.split(' ');
  if (parts.length !== 2) { req.user = null; return next(); }
  const token = parts[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      req.user = null;
      return next();
    }

    req.user = {
      id: data.user.id,        // UUID string
      email: data.user.email,
      raw: data.user
    };
    return next();
  } catch (err) {
    console.error('auth middleware error', err);
    req.user = null;
    return next();
  }
};
