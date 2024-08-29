// import "dotenv/config";
import user from "./user.js";
import role from "./role.js";
import measure from "./measure.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { join } from "path";
import { config } from "dotenv";
config({
  path: join(process.env.PWD.split("/").slice(0, -1).join("/"), ".env"),
});

const { Schema, model } = mongoose;
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
  )
  .then(() => logger.info("Database connection established!"))
  .catch((error) => logger.info({ error }));

const User = user(model, Schema);
const Role = role(model, Schema);
const Measure = measure(model, Schema);
export { User, Role, Measure };
