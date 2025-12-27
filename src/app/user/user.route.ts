// routes/user.routes.ts
import express from "express";
import {
  checkUser_Email,
  getSingleUser,
  logOut,
  allOrdersOfUser,
  getSingleUserBySlug,
  getContactInfoOfSingleUserBySlug,
  getStatus,
  getSingleOrder,
  getSingleUserById,
  getSingleUserForAddToCartComponent,
  getAuthenticatedUser,
  signUpByCredentials,
  singleForEditPage,
  update,
  allForAdminIndexPage,
  updateStatus,
  allStuffForAdminIndexPage,
  getSummaryOfActivity,
  getDetailsOFSingleUserForAdminCustomerDetailsComponent,
  updatePassword,
  googleUpsertUser,
  logInByCredentials,
  setCookie,
  allUserForAdmin,
  promoteUserToSellerByAdmin,
  updateUserPassword,
  singleForEditForSellerSettings,
  getAllSellerForFilterPage,
  updateSellerCommission,
  getUserByIdForAdmin,
  enabledOrDisableSellerByAdmin,
  updateUserPersonalInfo,
} from "./user.controller";
import { verUserTkn } from "./middlewares";
import { deleteById } from "../shared/reusableControllers";
import User from "./user.model";
import { verAdminTkn, verifyStuffToken } from "./middlewares";

const router = express.Router();

//=================== For user ===================
router.get("/singleUser/:userId", getSingleUser);
router.get("/getUserByIdForAdmin/:userId", getUserByIdForAdmin);

router.get("/getSingleUserBySlug/:userSlug", getSingleUserBySlug);
router.get("/getSingleUserById/:id", getSingleUserById);
router.get("/sellerStatus/:userSlug", getStatus);
router.get("/singleForEditPage/:id", verUserTkn, singleForEditPage);
router.get("/getSummaryOfActivity", verUserTkn, getSummaryOfActivity);
router.put("/update/:id", verUserTkn, update);

//================For user authentication ===================
router.get("/getAuthenticatedUser", getAuthenticatedUser);
router.post("/signUpByCredentials", signUpByCredentials);
router.post("/logInByCredentials", logInByCredentials);
router.post("/googleUpsertUser", googleUpsertUser);
router.post("/setCookie", setCookie);
router.post("/logout", logOut);

//===================== For Admin=====================
router.get("/getAllSellerForFilterPage", getAllSellerForFilterPage);
router.get("/allUserForAdmin", verAdminTkn, allUserForAdmin);
router.get(
  "/singleForEditForSellerSettings/:id",
  singleForEditForSellerSettings
);

router.patch(
  "/promoteUserToSellerByAdmin/:applicationId",
  verAdminTkn,
  promoteUserToSellerByAdmin
);
router.patch(
  "/enabledOrDisableSellerByAdmin/:sellerId",
  verAdminTkn,
  enabledOrDisableSellerByAdmin
);
router.patch("/updateUserPassword/:userId", verAdminTkn, updateUserPassword);
router.patch(
  "/updateSellerCommission/:userId",
  verAdminTkn,
  updateSellerCommission
);
router.get(
  "/getDetailsOFSingleUserForAdminCustomerDetailsComponent/:id",
  // verAdminTkn,
  getDetailsOFSingleUserForAdminCustomerDetailsComponent
);

router.get("/check-user-email", verUserTkn, checkUser_Email);
router.get("/checkStuff", verifyStuffToken, checkUser_Email);
router.get("/allOrdersOfUser", verUserTkn, allOrdersOfUser);
router.get("/getSingleOrder/:id", verUserTkn, getSingleOrder);
router.get("/allForAdminIndexPage", verAdminTkn, allForAdminIndexPage);
router.get(
  "/allStuffForAdminIndexPage",
  verAdminTkn,
  allStuffForAdminIndexPage
);

router.get(
  "/getContactInfoOfSingleUserBySlug/:userSlug",
  getContactInfoOfSingleUserBySlug
);
router.get(
  "/getSingleUserForAddToCartComponent/:id",
  getSingleUserForAddToCartComponent
);
router.patch(
  "/updateUserPersonalInfo/:userId",
  verUserTkn,
  updateUserPersonalInfo
);
router.patch("/updateStatus/:id", verAdminTkn, updateStatus);
router.patch("/updatePassword/:id", verAdminTkn, updatePassword);
router.delete("/delete/:id", verAdminTkn, deleteById(User));

export default router;
