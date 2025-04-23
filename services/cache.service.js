const NodeCache = require('node-cache');

/**
 * Cache service for storing API responses
 * Using in-memory cache for simplicity, a real implementation
 * might use Redis or another distributed cache
 */
const cache = new NodeCache({
  stdTTL: 3600, // Default TTL: 1 hour
  checkperiod: 600 // Check for expired keys every 10 minutes
});

/**
 * Get a value from cache
 * @param {string} key - Cache key
 * @returns {any|undefined} Cached value or undefined if not found
 */
function get(key) {
  return cache.get(key);
}

/**
 * Set a value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 * @returns {boolean} True if successful
 */
function set(key, value, ttl = 3600) {
  return cache.set(key, value, ttl);
}

/**
 * Delete a value from cache
 * @param {string} key - Cache key
 * @returns {number} Number of deleted entries
 */
function del(key) {
  return cache.del(key);
}

/**
 * Delete all cache entries that match a pattern
 * @param {string} pattern - Pattern to match (e.g., 'property:*')
 */
function delByPattern(pattern) {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  return cache.del(matchingKeys);
}

/**
 * Clear the entire cache
 */
function flush() {
  return cache.flushAll();
}

module.exports = {
  get,
  set,
  del,
  delByPattern,
  flush
};