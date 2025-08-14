const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const deviceController = require('../controllers/deviceController');

// Criar dispositivo
router.post('/', auth, deviceController.createDevice);

// Obter dispositivos por divisão (room)
router.get('/room/:roomId', auth, deviceController.getDevicesByRoom);

// Atualizar dispositivo
router.put('/:id', auth, deviceController.updateDevice);

// Eliminar dispositivo
router.delete('/:id', auth, deviceController.deleteDevice);

// Adicionar ação
router.post('/:id/actions', auth, deviceController.addActionToDevice);

// Remover ação (por índice)
router.delete('/:id/actions/:index', auth, deviceController.removeActionFromDevice);

module.exports = router;
