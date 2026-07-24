const {
  createOrganization,
  addMember,
  listMembers,
} = require('../model/Organisation');
const {
  createInvite,
  findValidInviteByCode,
  markInviteUsed,
} = require('../model/Invite');

// POST /api/orgs  — create an org, caller becomes its admin
async function createOrg(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Organization name is required' });
    }
    if (req.membership) {
      return res.status(409).json({ error: 'You already belong to an organization' });
    }

    const org = await createOrganization(name.trim());
    const membership = await addMember(org.id, req.user.id, 'admin');

    return res.status(201).json({ organization: org, membership });
  } catch (err) {
    console.error('createOrg error:', err);
    return res.status(500).json({ error: 'Failed to create organization' });
  }
}

// POST /api/orgs/invite  — admin only, generates a joinable invite code
async function generateInvite(req, res) {
  try {
    const { role } = req.body; // 'admin' | 'member', defaults to member
    const chosenRole = role === 'admin' ? 'admin' : 'member';

    const invite = await createInvite({
      orgId: req.membership.org_id,
      role: chosenRole,
      createdBy: req.user.id,
    });

    return res.status(201).json({ invite });
  } catch (err) {
    console.error('generateInvite error:', err);
    return res.status(500).json({ error: 'Failed to generate invite' });
  }
}

// POST /api/orgs/join  — caller joins an org using an invite code
async function joinOrg(req, res) {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Invite code is required' });
    }
    if (req.membership) {
      return res.status(409).json({ error: 'You already belong to an organization' });
    }

    const invite = await findValidInviteByCode(code.trim());
    if (!invite) {
      return res.status(400).json({ error: 'Invalid or expired invite code' });
    }

    const membership = await addMember(invite.org_id, req.user.id, invite.role);
    await markInviteUsed(invite.id, req.user.id);

    return res.status(200).json({ membership });
  } catch (err) {
    console.error('joinOrg error:', err);
    return res.status(500).json({ error: 'Failed to join organization' });
  }
}

// GET /api/orgs/me  — caller's current org + role
async function getMyOrg(req, res) {
  return res.status(200).json({ membership: req.membership });
}

// GET /api/orgs/members  — admin only, list all members of caller's org
async function getMembers(req, res) {
  try {
    const members = await listMembers(req.membership.org_id);
    return res.status(200).json({ members });
  } catch (err) {
    console.error('getMembers error:', err);
    return res.status(500).json({ error: 'Failed to list members' });
  }
}

module.exports = { createOrg, generateInvite, joinOrg, getMyOrg, getMembers };
