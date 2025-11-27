// Request Logger Middleware
exports.requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log request body for POST/PUT requests (exclude passwords)
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const logBody = { ...req.body };
    if (logBody.customer_password) logBody.customer_password = '***';
    if (logBody.password) logBody.password = '***';
    console.log('Body:', logBody);
  }

  next();
};