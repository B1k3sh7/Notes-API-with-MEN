const rateLimit = require("express-rate-limit");

const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 50, // Limit to 50 requests per 15 minutes
  message: "Too many request. Please try again later.",
  standardHeaders: true, // rate limit info rateLimit headers
  legacyHeaders: false, // Disable the X-RateLimit
});

module.exports = loginAccountLimiter;
