const PropertyService = require('../services/property.service');
const cacheService = require('../services/cache.service');

/**
 * Controller for property-related endpoints
 */
const propertyService = new PropertyService();

/**
 * Get property details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getPropertyDetails(req, res, next) {
  try {
    const { address } = req.query;
    
    // Check cache first
    const cacheKey = `property:${address}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    
    // If not in cache, fetch from service
    const propertyDetails = await propertyService.getPropertyDetails({ address });
    
    // Store in cache (1 hour TTL)
    cacheService.set(cacheKey, propertyDetails, 3600);
    
    return res.status(200).json(propertyDetails);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPropertyDetails
};