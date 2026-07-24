const { getMembershipByUserId } = require('../model/Organisation');

async function attachMembership(req, res, next) {
  try {
    const membership = await getMembershipByUserId(req.user.id);
    req.membership = membership || null;
    next();
  } catch (err) {
    console.error('attachMembership error:', err);
    return res.status(500).json({ error: 'Failed to load organization membership' });
  }
}

// Rejects if the caller has no org membership at all.
function requireMembership(req, res, next) {
  if (!req.membership) {
    return res.status(403).json({ error: 'You must belong to an organization to do this' });
  }
  next();
}


function requireAdmin(req, res, next) {
  if (!req.membership) {
    return res.status(403).json({ error: 'You must belong to an organization to do this' });
  }
  if (req.membership.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { attachMembership, requireMembership, requireAdmin };
