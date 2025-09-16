/**
 * Example portique webhook handler (Next.js API route)
 * Expects JSON { badge_id, direction, device_id, ts, signature }
 * Secured with HMAC using SHARED_SECRET (set in env as PORTIQUE_SECRET)
 */
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const SERVICE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHARED = process.env.PORTIQUE_SHARED_SECRET || '';

const admin = createClient(SERVICE_URL, SERVICE_KEY, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const payload = req.body || {};
  const { badge_id, direction='enter', device_id, ts, signature } = payload;
  if (!badge_id) return res.status(400).json({ error: 'badge_id required' });

  // verify HMAC if secret provided
  if (SHARED) {
    if (!signature) return res.status(401).json({ error: 'signature required' });
    const h = crypto.createHmac('sha256', SHARED).update(JSON.stringify({ badge_id, direction, device_id, ts })).digest('hex');
    if (h !== signature) return res.status(401).json({ error: 'invalid signature' });
  }

  // find badge
  const { data: badge } = await admin.from('badges').select('*, profiles(*)').eq('badge_id', badge_id).maybeSingle();
  const now = new Date().toISOString();
  if (!badge) {
    await admin.from('access_logs').insert([{ profile_id: null, scan_time: now, direction, source: device_id, metadata: { badge_id, status: 'unknown' } }]);
    return res.json({ action: 'deny', reason: 'badge_not_found' });
  }
  if (!badge.active) {
    await admin.from('access_logs').insert([{ profile_id: badge.profile_id, scan_time: now, direction, source: device_id, metadata: { badge_id, status: 'inactive' } }]);
    return res.json({ action: 'deny', reason: 'badge_inactive' });
  }

  // check subscription
  const { data: subs } = await admin.from('subscriptions').select('*').eq('profile_id', badge.profile_id).order('end_date',{ascending:false}).limit(1).maybeSingle();
  const allowed = subs && subs.status === 'active' && new Date(subs.end_date) >= new Date();
  await admin.from('access_logs').insert([{ profile_id: badge.profile_id, scan_time: now, direction, source: device_id, metadata: { badge_id, subscription: subs?.id, allowed: !!allowed } }]);

  if (allowed) return res.json({ action: 'open' });
  return res.json({ action: 'deny', reason: 'no_active_subscription' });
}
