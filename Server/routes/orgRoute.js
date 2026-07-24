const express = require('express');
const authMiddleware = require('../middleware/auth');
const { attachMembership, requireAdmin } = require('../middleware/orgMiddleware');
const {
  createOrg,
  generateInvite,
  joinOrg,
  getMyOrg,
  getMembers,
} = require('../controllers/orgController');

const router = express.Router();
router.use(authMiddleware, attachMembership);

router.post('/', createOrg);
router.post('/join', joinOrg);
router.get('/me', getMyOrg);

router.post('/invite', requireAdmin, generateInvite);
router.get('/members', requireAdmin, getMembers);

module.exports = router;
