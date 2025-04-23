/**
 * Custom error classes for the application
 */

/**
 * Base error class for the application
 */
class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for when a resource is not found
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message);
  }
}

/**
 * Error for when an external service fails
 */
class ExternalServiceError extends AppError {
  constructor(message = 'External service error') {
    super(message);
  }
}

/**
 * Error for validation failures
 */
class ValidationError extends AppError {
  constructor(message = 'Validation error', details = null) {
    super(message);
    this.details = details;
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ExternalServiceError,
  ValidationError
};