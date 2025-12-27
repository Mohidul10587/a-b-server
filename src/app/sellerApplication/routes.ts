import { Router } from "express";
import {
  allForAdminIndexPage,
  create,
  singleForAdmin,
  update,
  allForUserIndexPage,
  singleForUserForDetailsPageBySlug,
  allSlugsForUserIndexPage,
  rejectByAdmin,
} from "./controller";
import { verAdminTkn, verUserTkn } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import { SellerApplication } from "./model";

const router = Router();

//====================== For User ======================
// router.get("/allForUserIndexPage", allForUserIndexPage);
// router.get("/allSlugsForUserIndexPage", allSlugsForUserIndexPage);
// router.get("/singleForUserForDetailsPageBySlug/:slug", singleForUserForDetailsPageBySlug);

//====================== For Admin =====================
router.post("/create", verUserTkn, create);
router.get("/allForAdminIndexPage", verAdminTkn, allForAdminIndexPage);
router.get("/singleForAdmin/:id", verAdminTkn, singleForAdmin);
router.patch("/rejectByAdmin/:id", verAdminTkn, rejectByAdmin);
router.put("/update/:id", verAdminTkn, update);
router.delete("/delete/:id", verAdminTkn, deleteById(SellerApplication));

export default router;
