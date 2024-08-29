import logger from "../utils/logger.js";
const errorHandler = (err, req, res, next) => {
  // Identify the error type (custom or default)
  logger.error({
    message: verifyString(err?.message),
    stack: err?.stack,
    method: req?.method,
    url: req?.originalUrl,
    status: res?.statusCode,
    user: req?.user,
  });
  if (err?.statusCode) {
    return res.status(err?.statusCode).json(verifyString(err?.message));
  } else {
    // Handle unexpected errors gracefully
    logger.error(err?.stack); // Log for debugging
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
function verifyString(input) {
  try {
    // Try to parse the input as JSON
    const parsed = JSON.parse(input);

    // If successful, return the parsed JSON object
    return parsed;
  } catch (e) {
    // If an error occurs, it means the input is not a valid JSON string
    // Return the original string
    return input;
  }
}
export default errorHandler;
