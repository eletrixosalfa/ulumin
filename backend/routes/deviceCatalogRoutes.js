const express = require('express');
const router = express.Router();
const deviceCatalogController = require('../controllers/devicecatalogController');

router.get('/', deviceCatalogController.getAllCatalogDevices);
router.post('/', deviceCatalogController.addCatalogDevice);

module.exports = router;
