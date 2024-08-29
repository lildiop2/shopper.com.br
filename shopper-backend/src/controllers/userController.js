import userService from "../services/userService.js";
import { body, param, validationResult, matchedData } from "express-validator";
import {
  NotFoundError,
  ValidationError,
  UnprocessableEntityError,
  UnauthorizedError,
} from "../utils/error.js";
import logger from "../utils/logger.js";

class UserController {
  //validate
  validate = (method) => {
    switch (method) {
      case "createNewUser": {
        return [
          body("name").isString().withMessage("Name must be a string"),
          body("email")
            .isString()
            .isEmail()
            .withMessage("Email must be valid")
            .notEmpty()
            .withMessage("Email is required"),
          body("password")
            .isString()
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters long")
            .notEmpty()
            .withMessage("Password is required"),
          body("roles")
            .isArray({ min: 1 })
            .withMessage("Roles must be an array")
            .custom((roles) => {
              for (const role of roles) {
                if (!/^[0-9a-fA-F]{24}$/.test(role)) {
                  throw new Error("Each role must be a valid MongoDB ObjectId");
                }
              }
              return true;
            }),
        ];
      }
      case "getOneUser": {
        return [param("userId").exists().notEmpty().withMessage("invalid id")];
      }
      case "updateOneUser": {
        return [
          param("userId")
            .exists()
            .isMongoId()
            .notEmpty()
            .withMessage("invalid id"),
          body("name").isString().withMessage("Name must be a string"),
          body("email")
            .isString()
            .isEmail()
            .withMessage("Email must be valid")
            .notEmpty()
            .withMessage("Email is required"),
          body("password")
            .isString()
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters long")
            .notEmpty()
            .withMessage("Password is required"),
          body("roles")
            .isArray({ min: 1 })
            .withMessage("Roles must be an array")
            .custom((roles) => {
              for (const role of roles) {
                if (!/^[0-9a-fA-F]{24}$/.test(role)) {
                  throw new Error("Each role must be a valid MongoDB ObjectId");
                }
              }
              return true;
            }),
        ];
      }
      case "updateOneUserPartially": {
        return [
          param("userId")
            .exists()
            .isMongoId()
            .notEmpty()
            .withMessage("invalid id"),
          body("name")
            .isString()
            .optional({ checkFalsy: true })
            .withMessage("Name must be a string")
            .optional({ checkFalsy: true }),
          body("email")
            .isString()
            .isEmail()
            .withMessage("Email must be valid")
            .notEmpty()
            .withMessage("Email is required")
            .optional({ checkFalsy: true }),
          body("password")
            .isString()
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters long")
            .notEmpty()
            .withMessage("Password is required")
            .optional({ checkFalsy: true }),
          body("roles")
            .isArray({ min: 1 })
            .withMessage("Roles must be an array")
            .optional({ checkFalsy: true })
            .custom((roles) => {
              for (const role of roles) {
                if (!/^[0-9a-fA-F]{24}$/.test(role)) {
                  throw new Error("Each role must be a valid MongoDB ObjectId");
                }
              }
              return true;
            }),
        ];
      }
      case "deleteOneUser": {
        return [
          param("userId")
            .exists()
            .isMongoId()
            .notEmpty()
            .withMessage("invalid id"),
        ];
      }
      case "login": {
        return [
          body("email").exists().trim().isEmail(),
          body("password")
            .isString()
            .isLength({ min: 5 })
            .withMessage("Password must be at least 5 characters long")
            .notEmpty()
            .withMessage("Password is required"),
        ];
      }
    }
  };
  getAllUsers = async (req, res) => {
    const allUsers = await userService.getAllUsers();
    if (allUsers.length <= 0)
      throw new NotFoundError("Don't have user on the database!");
    logger.info({
      message: "User retrieve successfully",
      user: req.user,
    });
    return res.status(200).json(allUsers);
  };

  getOneUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { userId } = req.params;
    const foundUser = await userService.getOneUser(userId);
    if (!!!foundUser)
      throw new NotFoundError("Don't have this user on the database!");
    logger.info({
      message: "User retrieve one successfully",
      data: createdUser,
      user: req.user,
    });
    return res.status(200).json(foundUser);
  };

  createNewUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const newUser = matchedData(req);
    const createdUser = await userService.createNewUser(newUser);
    if (!!!createdUser) throw new UnprocessableEntityError();
    logger.info({
      message: "User added successfully",
      data: createdUser,
      user: req.user,
    });
    return res.status(201).json(createdUser);
  };

  updateOneUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { userId } = req.params;
    const user = matchedData(req);

    const updatedUser = await userService.updateOneUser({
      _id: userId,
      ...user,
    });
    if (!!!updatedUser) throw new UnprocessableEntityError();
    logger.info({
      message: "User updated successfully",
      data: updatedUser,
      user: req.user,
    });
    return res.status(200).json(updatedUser);
  };

  updateOneUserPartially = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { userId } = req.params;
    const user = matchedData(req);

    const updatedUser = await userService.updateOneUserPartially({
      _id: userId,
      ...user,
    });
    if (!!!updatedUser) throw new UnprocessableEntityError();
    logger.info({
      message: "User added partially successfully",
      data: updatedUser,
      user: req.user,
    });
    return res.status(200).json(updatedUser);
  };

  deleteOneUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { userId } = req.params;
    const deletedUser = await userService.deleteOneUser(userId);
    if (!!!deletedUser)
      throw new NotFoundError("Don't have this user on the database!");
    logger.info({
      message: "User deleted successfully",
      data: deletedUser,
      user: req.user,
    });
    return res.status(200).json(deletedUser);
  };

  login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { email, password } = matchedData(req);
    const authenticatedUser = await userService.login(email, password);
    if (!!!authenticatedUser) throw new UnauthorizedError();
    logger.info({
      message: "User logged in successfully",
      data: { email, password: password.replace(/./g, "*") },
    });
    return res.status(200).json(authenticatedUser);
  };
}

export default new UserController();
