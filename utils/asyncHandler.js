// Wraps async controllers so we don't have to write try/catch in every single route.
// If an error happens, it passes it to Express's global error handler.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;