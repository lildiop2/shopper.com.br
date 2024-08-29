import express from "express";
const router = express.Router();
import resolver from "../../middlewares/resolver.js"; //middleware for capture error and  avoid the app crashed
import { authenticate, authorize } from "../../middlewares/authenticated.js";
import userController from "../../controllers/userController.js";

router.get(
  "/",
  authenticate,
  authorize(["ADMIN", "ROOT"]),
  resolver(userController.getAllUsers)
);

router.get(
  "/:userId",
  authenticate,
  authorize(["ADMIN", "ROOT"]),
  userController.validate("getOneUser"),
  resolver(userController.getOneUser)
);

router.post(
  "/",
  userController.validate("createNewUser"),
  resolver(userController.createNewUser)
);

router.put(
  "/:userId",
  authenticate,
  authorize(["ADMIN", "ROOT"]),
  userController.validate("updateOneUser"),
  resolver(userController.updateOneUser)
);
router.patch(
  "/:userId",
  authenticate,
  authorize(["ADMIN", "ROOT"]),
  userController.validate("updateOneUserPartially"),
  resolver(userController.updateOneUserPartially)
);

router.delete(
  "/:userId",
  authenticate,
  authorize(["ADMIN", "ROOT"]),
  userController.validate("deleteOneUser"),
  resolver(userController.deleteOneUser)
);

router.post(
  "/login",
  userController.validate("login"),
  resolver(userController.login)
);

export default router;
