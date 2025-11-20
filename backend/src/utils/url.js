/**
 * Get base URL for API endpoints
 * Uses environment variable API_BASE_URL if set, otherwise constructs from request
 */
export const getBaseUrl = (req = null) => {
  // If API_BASE_URL is set in environment, use it
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  
  // If request object is provided, use it to construct URL
  if (req) {
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    return `${protocol}://${host}`;
  }
  
  // Fallback: use environment variables or defaults
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const domain = process.env.DOMAIN || 'localhost:3000';
  return `${protocol}://${domain}`;
};

/**
 * Get API URL for a specific endpoint
 */
export const getApiUrl = (endpoint, req = null) => {
  const baseUrl = getBaseUrl(req);
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

