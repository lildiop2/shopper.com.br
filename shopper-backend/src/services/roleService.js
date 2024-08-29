import { Role } from "../models/database.js";
import {
  NotFoundError,
  UnprocessableEntityError,
  ValidationError,
} from "../utils/error.js";

class RoleService {
  createNewRole = async (role) => {
    const { name, ...rest } = role;
    const existingRole = await this.getRoleByName(name);
    if (!!existingRole) throw new ValidationError("existing role");

    return await Role.create({
      name,
      ...rest,
    });
  };
  getAllRoles = async () => {
    return await Role.find({}, { createdAt: 0, updatedAt: 0 });
  };
  getOneRole = async (id) => {
    return await Role.findById(id, {
      createdAt: 0,
      updatedAt: 0,
    });
  };
  updateOneRole = async (role) => {
    const { _id, ...rest } = role;
    return await Role.findByIdAndUpdate(
      _id,
      { ...rest },
      {
        new: true,
        select: {
          createdAt: 0,
          updatedAt: 0,
        },
      }
    );
  };
  updateOneRolePartially = async (role) => {
    const { _id, ...rest } = role;
    return await Role.findByIdAndUpdate(
      _id,
      { ...rest },
      {
        new: true,
        select: {
          createdAt: 0,
          updatedAt: 0,
        },
      }
    );
  };
  deleteOneRole = async (id) => {
    return await Role.findByIdAndDelete(id);
  };

  getRoleByName = async (name) => {
    return await Role.findOne({ name });
  };
}

export default new RoleService();
