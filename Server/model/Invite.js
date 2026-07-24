const crypto = require('crypto');
const pool = require('../config/database');

function generateCode() {
  return crypto.randomBytes(6).toString('hex'); // 12-char code
}

async function createInvite({ orgId, role, createdBy, expiresInDays = 7 }) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  const result = await pool.query(
    `INSERT INTO invites (org_id, code, role, created_by, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, code, role, expires_at, created_at`,
    [orgId, code, role, createdBy, expiresAt]
  );
  return result.rows[0];
}

async function findValidInviteByCode(code) {
  const result = await pool.query(
    `SELECT * FROM invites
     WHERE code = $1 AND used_by IS NULL AND expires_at > NOW()`,
    [code]
  );
  return result.rows[0];
}

async function markInviteUsed(inviteId, userId) {
  await pool.query(
    `UPDATE invites SET used_by = $1, used_at = NOW() WHERE id = $2`,
    [userId, inviteId]
  );
}

module.exports = { createInvite, findValidInviteByCode, markInviteUsed };
