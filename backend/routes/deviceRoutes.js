const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const deviceController = require('../controllers/deviceController');

// Criar dispositivo
router.post('/', auth, deviceController.createDevice);

// Obter dispositivos por categoria
router.get('/category/:categoryId', auth, deviceController.getDevicesByCategory);

// Obter dispositivos por divisão (room)
router.get('/room/:roomId', auth, deviceController.getDevicesByRoom);

// Atualizar dispositivo
router.put('/:id', auth, deviceController.updateDevice);

// Eliminar dispositivo
router.delete('/:id', auth, deviceController.deleteDevice);

module.exports = router;
