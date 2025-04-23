/**
 * Middleware for validating request inputs
 */

/**
 * Validate address query parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function validateAddress(req, res, next) {
  const { address1, address2 } = req.query;
  
  if (!address1) {
    return res.status(400).json({
      message: 'Street address is required',
      errorCode: 'MISSING_ADDRESS1',
      details: 'Please provide a valid street address as a query parameter'
    });
  }

  if (!address2) {
    return res.status(400).json({
      message: 'Postal code is required',
      errorCode: 'MISSING_ADDRESS2',
      details: 'Please provide a city  name and state code as a query parameter'
    });
  }
  
  if (typeof address1 !== 'string' || typeof address2 !== 'string') {
    return res.status(400).json({
      message: 'Invalid parameter format',
      errorCode: 'INVALID_PARAMETER_FORMAT',
      details: 'Address1 and Address2 must be strings'
    });
  }
  
 
  
  // If all validations pass, continue to the next middleware
  next();
}

module.exports = {
  validateAddress
};