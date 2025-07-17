const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const scheduleController = require('../controllers/scheduleController');

router.post('/', auth, scheduleController.createSchedule);
router.get('/', auth, scheduleController.getSchedules);
router.put('/:id', auth, scheduleController.updateSchedule);
router.delete('/:id', auth, scheduleController.deleteSchedule);

module.exports = router;