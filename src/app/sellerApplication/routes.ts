import { Router } from "express";
import {
  allForAdminIndexPage,
  create,
  singleForAdmin,
  update,
  allForUserIndexPage,
  singleForUserForDetailsPageBySlug,
  allSlugsForUserIndexPage,
  updateSellerApplicationStatus,
} from "./controller";
import { verifyAdminToken, verifyUserToken } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import { SellerApplication } from "./model";

const router = Router();

//====================== For User ======================
// router.get("/allForUserIndexPage", allForUserIndexPage);
// router.get("/allSlugsForUserIndexPage", allSlugsForUserIndexPage);
// router.get("/singleForUserForDetailsPageBySlug/:slug", singleForUserForDetailsPageBySlug);

//====================== For Admin =====================
router.post("/create", verifyUserToken, create);
router.get("/allForAdminIndexPage", verifyAdminToken, allForAdminIndexPage);
router.get("/singleForAdmin/:id", verifyAdminToken, singleForAdmin);
router.put(
  "/updateSellerApplicationStatus/:id",
  verifyAdminToken,
  updateSellerApplicationStatus
);
// router.put("/update/:id", verifyAdminToken, update);
// router.delete("/delete/:id", verifyAdminToken, deleteById(SellerApplication));

export default router;
