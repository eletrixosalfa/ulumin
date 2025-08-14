const express = require('express');
const router = express.Router();
const deviceCatalogController = require('../controllers/deviceCatalogController');

router.get('/model/:model', deviceCatalogController.getActionsByModel);
router.get('/', deviceCatalogController.getAllCatalogDevices);
router.post('/', deviceCatalogController.addCatalogDevice);

module.exports = router;
