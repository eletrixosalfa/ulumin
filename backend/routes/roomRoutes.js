const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const roomController = require('../controllers/roomController');

router.post('/', auth, roomController.createRoom);
router.get('/', auth, roomController.getRooms);
router.put('/:id', auth, roomController.updateRoom);
router.delete('/:id', auth, roomController.deleteRoom);

module.exports = router;
