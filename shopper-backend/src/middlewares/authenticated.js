import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "../utils/error.js";

const authenticate = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token)
      throw new UnauthorizedError(
        JSON.stringify({ message: "You are not authorized" })
      );
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    throw new ForbiddenError(
      JSON.stringify({
        message: "You don't have permission",
        expiredAt: error?.expiredAt,
      })
    );
  }
};

/**
 * Middleware to check if the user has the required roles.
 * @param {Array} requiredRoles - The roles required to access the route.
 */
const authorize = (requiredRoles) => {
  return function (req, res, next) {
    const user = req.user; // Assuming user information is attached to req object
    if (!user || !user.roles)
      throw new UnauthorizedError(
        JSON.stringify({ message: "You are not authorized" })
      );

    // Check if the user has any of the required roles
    const hasRole = user.roles
      .map((role) => role.name)
      .some((role) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenError(
        JSON.stringify({
          message: "You don't have permission",
        })
      );
    }

    next();
  };
};

export { authenticate, authorize };
