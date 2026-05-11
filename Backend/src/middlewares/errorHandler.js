// Global error handling middleware
// Returns consistent JSON error responses and logs server-side errors
export function errorHandler(err, req, res, next) {
  console.error("ErrorHandler:", err); // keep server-side visibility

  const status = err.status || err.statusCode || 500;
  const message = status >= 500
    ? "Internal Server Error"
    : (err.clientMessage || err.message || "Request failed");

  res.status(status).json({
    error: message,
    message,
    supported: false,
  });
}
