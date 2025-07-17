const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const mqttController = require('../controllers/mqttConfigController');

router.post('/', auth, mqttController.createOrUpdateMqttConfig);
router.get('/', auth, mqttController.getMqttConfig);
router.delete('/', auth, mqttController.deleteMqttConfig);


module.exports = router;
