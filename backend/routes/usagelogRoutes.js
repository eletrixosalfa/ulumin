const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const usageLogController = require('../controllers/usagelogController');

router.post('/', auth, usageLogController.createUsageLog);
router.put('/:id', auth, usageLogController.updateUsageLog);
router.get('/', auth, usageLogController.getUsageLogs);

module.exports = router;
