// src/services/LogService.js
const supabase = require('../db/supabaseClient');

module.exports = {
  async create({ userId = null, timestamp = null, posture, confidence = null, durationSeconds = null, note = null }) {
    if (!posture) throw new Error('posture required');
    const ts = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    const payload = {
      user_id: userId,
      timestamp: ts,
      posture,
      confidence,
      duration_seconds: durationSeconds,
      note
    };
    const { data, error } = await supabase.from('posture_logs').insert(payload).select().maybeSingle();
    if (error) throw error;
    return data;
  },

  async get({ from = null, to = null, userId = null }) {
    let q = supabase.from('posture_logs').select('*').order('timestamp', { ascending: false }).limit(1000);
    if (userId) q = q.eq('user_id', userId);
    if (from) q = q.gte('timestamp', new Date(from).toISOString());
    if (to) q = q.lte('timestamp', new Date(to).toISOString());
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async summary({ days = 7, userId = null }) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    let q = supabase.from('posture_logs').select('*').gte('timestamp', since.toISOString());
    if (userId) q = q.eq('user_id', userId);
    const { data, error } = await q;
    if (error) throw error;
    const summary = {};
    data.forEach(r => { summary[r.posture] = (summary[r.posture] || 0) + 1; });
    return { days, since: since.toISOString(), totals: summary, rawCount: data.length };
  }
};
