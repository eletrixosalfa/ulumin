const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const mqttController = require('../controllers/mqttConfigController');

router.get('/', auth, mqttController.getMqttConfig);
router.post('/', auth, mqttController.createOrUpdateMqttConfig);
router.delete('/', auth, mqttController.deleteMqttConfig);

router.post('/test', auth, mqttController.testMqttConnection);
router.post('/reset', auth, mqttController.resetMqttConfig);
router.get('/status', auth, mqttController.getMqttStatus);

module.exports = router;
