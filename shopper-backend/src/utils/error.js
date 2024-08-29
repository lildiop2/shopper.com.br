class IllegalArgumentException extends Error {
  constructor(message) {
    super(message);
  }
}

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ResourceNotFoundError extends HttpError {
  constructor(message) {
    super(404, message || "Resource not found");
  }
}

class ValidationError extends HttpError {
  constructor(message) {
    super(400, message || "Validation failed");
  }
}

class InternalServerError extends HttpError {
  constructor(message) {
    super(500, message || "Internal server error");
  }
}
class UnauthorizedError extends HttpError {
  constructor(message) {
    super(401, message || "You are not authorized to access this resource.");
  }
}
class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message || "The resource you requested could not be found.");
  }
}
class ForbiddenError extends HttpError {
  constructor(message) {
    super(403, message || "You don't have permission to access this resource.");
  }
}
class ConflictError extends HttpError {
  constructor(message) {
    super(409, message || "This resource have already on the system");
  }
}

class BadRequestError extends HttpError {
  constructor(message) {
    super(400, message || "Bad request");
  }
}
class UnprocessableEntityError extends HttpError {
  constructor(message) {
    super(422, message || "Unprocessable entity");
  }
}
class TooManyRequestsError extends HttpError {
  constructor(message) {
    super(429, message || "Too many requests");
  }
}
export {
  ConflictError,
  ForbiddenError,
  IllegalArgumentException,
  InternalServerError,
  NotFoundError,
  ResourceNotFoundError,
  UnauthorizedError,
  ValidationError,
  BadRequestError,
  UnprocessableEntityError,
  TooManyRequestsError,
};
