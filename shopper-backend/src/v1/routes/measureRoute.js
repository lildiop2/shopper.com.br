import express from "express";
const router = express.Router();
import resolver from "../../middlewares/resolver.js"; //middleware for capture error and  avoid the app crashed
import measureController from "../../controllers/measureController.js";

import { authenticate, authorize } from "../../middlewares/authenticated.js";
// router.get(
//   "/",
//   authenticate,
//   authorize(["DEFAULT"]),
//   resolver(measureController.getAllMeasures)
// );

router.post(
  "/upload",
  measureController.validate("upload"),
  resolver(measureController.upload)
);
router.patch(
  "/confirm",
  measureController.validate("confirm"),
  resolver(measureController.confirm)
);
router.get(
  "/:customer_code/list",
  measureController.validate("list"),
  resolver(measureController.list)
);

export default router;
