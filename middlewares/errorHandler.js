const { 
  NotFoundError, 
  ExternalServiceError,
  ValidationError
} = require('../utils/errors');

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.message,
      errorCode: 'PROPERTY_NOT_FOUND',
      details: 'The requested property could not be found in our database'
    });
  }
  
  if (err instanceof ExternalServiceError) {
    return res.status(502).json({
      message: err.message,
      errorCode: 'EXTERNAL_SERVICE_ERROR',
      details: 'There was an issue connecting to the property data provider'
    });
  }
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
      errorCode: 'VALIDATION_ERROR',
      details: err.details
    });
  }
  
  // Default error handler for unhandled errors
  return res.status(500).json({
    message: 'Internal server error',
    errorCode: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
}

module.exports = {
  errorHandler
};