// Database connection status
let databaseInitialized = false;

// Set database status
const setDatabaseStatus = (status) => {
  databaseInitialized = status;
};

// Middleware to check database connection
const checkDatabase = (req, res, next) => {
  if (!databaseInitialized) {
    return res.status(503).json({ 
      error: 'Database not initialized',
      message: 'The database is not ready to accept connections'
    });
  }
  next();
};

// Middleware to validate request body exists
const validateRequestBody = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: 'Request body is required',
        message: 'The request must include a valid JSON body'
      });
    }
  }
  next();
};

// Middleware to validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;
  
  if (page !== undefined) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ 
        error: 'Invalid page parameter',
        message: 'Page must be a positive integer'
      });
    }
    req.pagination = { page: pageNum };
  }
  
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ 
        error: 'Invalid limit parameter',
        message: 'Limit must be a positive integer between 1 and 100'
      });
    }
    req.pagination = { ...req.pagination, limit: limitNum };
  }
  
  next();
};

// Middleware to validate content type for POST/PUT requests
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({ 
        error: 'Invalid content type',
        message: 'Content-Type must be application/json'
      });
    }
  }
  next();
};

// Middleware to sanitize string inputs
const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    // Sanitize string fields
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Trim whitespace
        req.body[key] = req.body[key].trim();
        
        // Remove potentially dangerous characters (basic XSS prevention)
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]*>/g, '');
      }
    });
  }
  next();
};

// Middleware to log requests
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({ 
      error: 'Database connection error',
      message: 'Unable to connect to the database'
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation error',
      message: err.message
    });
  }
  
  // Default server error
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
};

module.exports = {
  setDatabaseStatus,
  checkDatabase,
  validateRequestBody,
  validatePagination,
  validateContentType,
  sanitizeInputs,
  logRequest,
  errorHandler,
  notFoundHandler
}; 