import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/database.js";
import {
  NotFoundError,
  UnprocessableEntityError,
  ValidationError,
} from "../utils/error.js";
const SALT = 10;

class UserService {
  createNewUser = async (user) => {
    const { password, email, ...rest } = user;
    const existingUser = await this.getUserByEmail(email);
    if (!!existingUser) throw new ValidationError("existing user");
    const hash_password = await hash(password, SALT);
    const newUser = await User.create({
      password: hash_password,
      email,
      ...rest,
    });
    return {
      name: newUser.name,
      email: newUser.email,
      roles: newUser.roles,
      _id: newUser._id,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  };
  getAllUsers = async () => {
    return await User.find({}, { password: 0, createdAt: 0, updatedAt: 0 })
      .populate("roles", "_id name description")

      .exec();
  };
  getOneUser = async (id) => {
    return await User.findById(id, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    })
      .populate("roles", "_id name description")

      .exec();
  };
  updateOneUser = async (user) => {
    const { _id, password, ...rest } = user;
    const hash_password = await hash(password, SALT);
    return await User.findByIdAndUpdate(
      _id,
      { password: hash_password, ...rest },
      {
        new: true,
        select: {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      }
    );
  };
  updateOneUserPartially = async (user) => {
    const { _id, ...rest } = user;
    return await User.findByIdAndUpdate(
      _id,
      { ...rest },
      {
        new: true,
        select: {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      }
    );
  };
  deleteOneUser = async (id) => {
    const user = await this.getOneUser(id);
    const isRootUser = user?.roles?.some((role) => role.name === "ROOT");
    if (isRootUser) return null;
    return await User.findByIdAndDelete(id);
  };

  changePassword = async (id, oldPassword, newPassword) => {
    const user = await User.findById(id);
    if (!user) throw new ValidationError("user not exist");
    const isMatch = await compare(oldPassword, user.password);
    if (isMatch) {
      const hash_password = await hash(newPassword, SALT);
      return await User.findByIdAndUpdate(
        id,
        { password: hash_password },
        {
          new: true,
          select: {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        }
      );
    }
    throw new Error("old password is wrong");
  };

  login = async (email, password) => {
    const user = await this.getUserByEmail(email);
    if (!user) throw new ValidationError("user not exist");
    const isMatch = await compare(password, user.password);
    if (isMatch) {
      const tokenExpire = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // expires in 7 day 7 * 24 * 60 * 60
      const token = jwt.sign(
        {
          exp: tokenExpire,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
          },
        },
        process.env.JWT_SECRET
      );

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        token,
        tokenExpire: new Date(tokenExpire * 1000),
      };
    }
    throw new ValidationError("password or email is wrong");
  };

  getUserByEmail = async (email) => {
    return await User.findOne({ email })
      .populate("roles", "_id name")

      .exec();
  };
}

export default new UserService();
