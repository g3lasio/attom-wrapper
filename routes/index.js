const express = require('express');
const propertyRoutes = require('./property.routes');

const router = express.Router();

router.use('/property', propertyRoutes);

module.exports = router;