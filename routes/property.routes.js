const express = require('express');
const { getPropertyDetails } = require('../controllers/property.controller');
const { validateAddress } = require('../middlewares/validation');

const router = express.Router();

/**
 * @route GET /api/property/details
 * @desc Get property details and ownership information
 * @access Public
 */
router.get('/details', validateAddress, getPropertyDetails);

module.exports = router;