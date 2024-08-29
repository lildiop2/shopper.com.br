const generateCacheKey = (req) => {
  const { path, url, method, query, body } = req;

  // Simple example: combine URL, method, and query string
  const baseKey = `${method}:${url}${queryString(query)}`;
  logger.info({ path });
  // Handle body if necessary (e.g., for POST requests)
  const bodyKey = body ? JSON.stringify(body) : "";

  // Consider additional parameters or hashing for complex scenarios
  const cacheKey = `${baseKey}:${bodyKey}`; // Adjust as needed

  return cacheKey;
};

const queryString = (query) => {
  return Object.keys(query)
    .sort() // Ensure consistent order of query parameters
    .map((key) => `${key}=${query[key]}`)
    .join("&");
};

export { generateCacheKey };
