// src/controllers/settingsController.js
const supabase = require('../db/supabaseClient');

exports.getSettings = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    if (!userId) return res.json({ ok: true, settings: { reminderIntervalMinutes: 20, sensitivity: 0.5 } });

    const { data, error } = await supabase.from('settings').select('*').eq('user_id', userId).limit(1).maybeSingle();
    if (error) throw error;
    if (!data) return res.json({ ok: true, settings: { reminderIntervalMinutes: 20, sensitivity: 0.5 } });
    // normalize keys for frontend
    return res.json({ ok: true, settings: {
      reminderIntervalMinutes: data.reminder_interval_minutes,
      sensitivity: parseFloat(data.sensitivity),
      raw: data
    }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to fetch settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    if (!userId) return res.status(401).json({ error: 'login required' });

    const { reminderIntervalMinutes, sensitivity } = req.body;
    const payload = {
      user_id: userId,
      reminder_interval_minutes: typeof reminderIntervalMinutes === 'number' ? reminderIntervalMinutes : 20,
      sensitivity: typeof sensitivity === 'number' ? sensitivity : 0.5
    };

    // upsert via on_conflict user_id; maybeSingle() helps fetch single row
    const { data, error } = await supabase
      .from('settings')
      .upsert(payload, { onConflict: 'user_id', returning: 'representation' })
      .select()
      .maybeSingle();

    if (error) throw error;
    return res.json({ ok: true, settings: {
      reminderIntervalMinutes: data.reminder_interval_minutes,
      sensitivity: parseFloat(data.sensitivity),
      raw: data
    }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to update settings' });
  }
};
