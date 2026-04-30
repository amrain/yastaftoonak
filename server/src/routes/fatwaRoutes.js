const express = require('express');
const {
  createFatwa,
  deleteFatwa,
  getFatwaById,
  getFatwaStats,
  listFatwas,
  updateFatwa,
} = require('../controllers/fatwaController');
const { optionalAuth, requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, listFatwas);
router.get('/stats/summary', requireAuth, requireRole('admin', 'sheikh'), getFatwaStats);
router.get('/:id', optionalAuth, getFatwaById);
router.post('/', createFatwa);
router.patch('/:id', requireAuth, requireRole('admin', 'sheikh'), updateFatwa);
router.delete('/:id', requireAuth, requireRole('admin'), deleteFatwa);

module.exports = router;
