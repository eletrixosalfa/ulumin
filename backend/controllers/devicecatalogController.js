const express = require('express');
const router = express.Router();
const deviceCatalog = require('../models/deviceCatalog');

router.get('/model/:model', (req, res) => {
  const { model } = req.params;
  const found = deviceCatalog.find(d => d.model === model);
  if (found) {
    res.json({ actions: found.actions });
  } else {
    res.json({ actions: [] });
  }
});

module.exports = router;