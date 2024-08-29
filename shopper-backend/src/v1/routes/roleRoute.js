import express from "express";
const router = express.Router();
import roleController from "../../controllers/roleController.js";
import resolver from "../../middlewares/resolver.js"; //middleware for capture error and  avoid the app crashed
import { authenticate, authorize } from "../../middlewares/authenticated.js";
router.get("/", resolver(roleController.getAllRoles));

router.get(
  "/:roleId",
  authenticate,
  authorize(["ADMIN"]),
  roleController.validate("getOneRole"),
  resolver(roleController.getOneRole)
);

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  roleController.validate("createNewRole"),
  resolver(roleController.createNewRole)
);

router.put(
  "/:roleId",
  authenticate,
  authorize(["ADMIN"]),
  roleController.validate("updateOneRole"),
  resolver(roleController.updateOneRole)
);
router.patch(
  "/:roleId",
  authenticate,
  authorize(["ADMIN"]),
  roleController.validate("updateOneRolePartially"),
  resolver(roleController.updateOneRolePartially)
);

router.delete(
  "/:roleId",
  authenticate,
  authorize(["ADMIN"]),
  roleController.validate("deleteOneRole"),
  resolver(roleController.deleteOneRole)
);

export default router;
