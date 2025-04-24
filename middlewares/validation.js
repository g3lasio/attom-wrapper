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
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({
      message: 'address is required',
      errorCode: 'MISSING_ADDRESS',
      details: 'Please provide a valid address as a query parameter'
    });
  }


  if (typeof address !== 'string' ) {
    return res.status(400).json({
      message: 'Invalid parameter format',
      errorCode: 'INVALID_PARAMETER_FORMAT',
      details: 'Address must be string'
    });
  }
  
 
  
  // If all validations pass, continue to the next middleware
  next();
}

module.exports = {
  validateAddress
};