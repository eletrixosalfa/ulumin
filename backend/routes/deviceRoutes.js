const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const deviceController = require('../controllers/deviceController');

router.post('/', auth, deviceController.createDevice);
router.get('/room/:roomId', auth, deviceController.getDevices);
router.put('/:id', auth, deviceController.updateDevice);
router.delete('/:id', auth, deviceController.deleteDevice);

module.exports = router;
