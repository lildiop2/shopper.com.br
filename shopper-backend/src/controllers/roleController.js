import roleService from "../services/roleService.js";
import { body, param, validationResult, matchedData } from "express-validator";
import {
  NotFoundError,
  ValidationError,
  UnprocessableEntityError,
} from "../utils/error.js";
// {
//     getAllRoles,
//     getOneRole,
//     createNewRole,
//     updateOneRole,
//     deleteOneRole,
//   }

class RoleController {
  //valide
  validate = (method) => {
    switch (method) {
      case "createNewRole": {
        return [
          body("name")
            .isString()
            .toUpperCase()
            .withMessage("Name must be a string")
            .notEmpty()
            .withMessage("Name is required")
            .custom((value) => value === value.toUpperCase())
            .withMessage("Name must be uppercase"),
          body("description")
            .isString()
            .optional({ checkFalsy: true })
            .withMessage("Description must be a string"),
        ];
      }
      case "getOneRole": {
        return [
          param("roleId")
            .exists()
            .isMongoId()
            .notEmpty()
            .withMessage("invalid id"),
        ];
      }
      case "updateOneRole": {
        return [
          param("roleId")
            .exists()
            .isMongoId()
            .notEmpty()
            .withMessage("invalid id"),
          body("name")
            .isString()
            .toUpperCase()
            .withMessage("Name must be a string")
            .notEmpty()
            .withMessage("Name is required")
            .custom((value) => value === value.toUpperCase())
            .withMessage("Name must be uppercase"),
          body("description")
            .isString()
            .optional({ checkFalsy: true })
            .withMessage("Description must be a string"),
        ];
      }
      case "updateOneRolePartially": {
        return [
          param("roleId")
            .exists()
            .isMongoId()
            .notEmpty()
            .withMessage("invalid id"),
          body("name")
            .isString()
            .toUpperCase()
            .withMessage("Name must be a string")
            .notEmpty()
            .withMessage("Name is required")
            .custom((value) => value === value.toUpperCase())
            .withMessage("Name must be uppercase"),
          body("description")
            .isString()
            .optional({ checkFalsy: true })
            .withMessage("Description must be a string"),
        ];
      }
      case "deleteOneRole": {
        return [
          param("roleId")
            .exists()
            .isMongoId()
            .notEmpty()
            .withMessage("invalid id"),
        ];
      }
    }
  };
  getAllRoles = async (req, res) => {
    const allRoles = await roleService.getAllRoles();
    if (allRoles.length <= 0)
      throw new NotFoundError("Don't have role on the database!");
    return res.status(200).json(allRoles);
  };

  getOneRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { roleId } = req.params;
    const foundRole = await roleService.getOneRole(roleId);
    if (!!!foundRole)
      throw new NotFoundError("Don't have this role on the database!");
    return res.status(200).json(foundRole);
  };

  createNewRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const newRole = matchedData(req);
    const createdRole = await roleService.createNewRole(newRole);
    if (!!!createdRole) throw new UnprocessableEntityError();
    return res.status(201).json(createdRole);
  };

  updateOneRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { roleId } = req.params;
    const role = matchedData(req);

    const updatedRole = await roleService.updateOneRole({
      _id: roleId,
      ...role,
    });
    if (!!!updatedRole) throw new UnprocessableEntityError();
    return res.status(200).json(updatedRole);
  };

  updateOneRolePartially = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { roleId } = req.params;
    const role = matchedData(req);

    const updatedRole = await roleService.updateOneRolePartially({
      _id: roleId,
      ...role,
    });
    if (!!!updatedRole) throw new UnprocessableEntityError();
    return res.status(200).json(updatedRole);
  };

  deleteOneRole = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(JSON.stringify(errors.array()));
    }
    const { roleId } = req.params;
    const deletedRole = await roleService.deleteOneRole(roleId);
    if (!!!deletedRole)
      throw new NotFoundError("Don't have this role on the database!");
    return res.status(200).json(deletedRole);
  };
}

export default new RoleController();
