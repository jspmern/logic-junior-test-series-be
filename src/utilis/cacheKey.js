// utils/cacheKey.js

/**
 * Build a unique cache key based on:
 * - a prefix (like 'courses')
 * - request path (like '/api/courses')
 * - query parameters (like ?page=2)
 * - params (like /:id)
 *
 * This ensures every route + query combo has a unique cache key.
 */
function buildCacheKey(req, prefix = "") {
  let keyParts = [];

  // Prefix (like "courses" or "users")
  if (prefix) keyParts.push(prefix);

  // Add route path (to separate /api/courses and /api/users)
  if (req.baseUrl) keyParts.push(req.baseUrl.replace(/\//g, ":"));

  // Add params (like course/:id)
  if (req.params && Object.keys(req.params).length > 0) {
    const paramString = Object.entries(req.params)
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    keyParts.push(`params:${paramString}`);
  }

  // Add query (like ?page=1&limit=10)
  if (req.query && Object.keys(req.query).length > 0) {
    const queryString = Object.entries(req.query)
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    keyParts.push(`query:${queryString}`);
  }

  // Combine everything into one string
  const key = keyParts.join("::").toLowerCase();

  return key;
}

module.exports = { buildCacheKey };
