const express = require('express');
const router = express.Router();
const deviceCatalogController = require('../controllers/devicecatalogController');

// Nova rota para obter ações por modelo
router.get('/model/:model', deviceCatalogController.getActionsByModel);

module.exports = router;
