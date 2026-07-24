const pool = require('../config/database');

async function createOrganization(name) {
  const result = await pool.query(
    `INSERT INTO organizations (name) VALUES ($1) RETURNING id, name, created_at`,
    [name]
  );
  return result.rows[0];
}

async function addMember(orgId, userId, role) {
  const result = await pool.query(
    `INSERT INTO organization_members (org_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING id, org_id, user_id, role, created_at`,
    [orgId, userId, role]
  );
  return result.rows[0];
}

async function getMembershipByUserId(userId) {
  const result = await pool.query(
    `SELECT om.*, o.name AS org_name
     FROM organization_members om
     JOIN organizations o ON o.id = om.org_id
     WHERE om.user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function listMembers(orgId) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, om.role, om.created_at
     FROM organization_members om
     JOIN users u ON u.id = om.user_id
     WHERE om.org_id = $1
     ORDER BY om.created_at ASC`,
    [orgId]
  );
  return result.rows;
}

module.exports = { createOrganization, addMember, getMembershipByUserId, listMembers };
