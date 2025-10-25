// routes/user.routes.ts
import express from "express";
import {
  checkUser_Email,
  getSingleUser,
  updateUser,
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
  updateSellerStatus,
  updateUserPassword,
  singleForEditForSellerSettings,
  getAllSellerForFilterPage,
  updateSellerCommission,
  getUserByIdForAdmin,
} from "./user.controller";
import { verifyUserToken } from "./middlewares";
import { deleteById } from "../shared/reusableControllers";
import User from "./user.model";
import { verifyAdminToken, verifyStuffToken } from "./middlewares";

const router = express.Router();

//=================== For user ===================
router.get("/singleUser/:userId", getSingleUser);
router.get("/getUserByIdForAdmin/:userId", getUserByIdForAdmin);

router.get("/getSingleUserBySlug/:userSlug", getSingleUserBySlug);
router.get("/getSingleUserById/:id", getSingleUserById);
router.get("/sellerStatus/:userSlug", getStatus);
router.get("/singleForEditPage/:id", verifyUserToken, singleForEditPage);
router.get("/getSummaryOfActivity", verifyUserToken, getSummaryOfActivity);
router.put("/update/:id", verifyUserToken, update);

//================For user authentication ===================
router.get("/getAuthenticatedUser", getAuthenticatedUser);
router.post("/signUpByCredentials", signUpByCredentials);
router.post("/logInByCredentials", logInByCredentials);
router.post("/googleUpsertUser", googleUpsertUser);
router.post("/setCookie", setCookie);
router.post("/logout", logOut);

//===================== For Admin=====================
router.get("/getAllSellerForFilterPage", getAllSellerForFilterPage);
router.get("/allUserForAdmin", verifyAdminToken, allUserForAdmin);
router.get(
  "/singleForEditForSellerSettings/:id",
  singleForEditForSellerSettings
);

router.patch(
  "/updateSellerStatusOfUser/:userId",
  verifyAdminToken,
  updateSellerStatus
);

router.patch(
  "/updateUserPassword/:userId",
  verifyAdminToken,
  updateUserPassword
);
router.patch(
  "/updateSellerCommission/:userId",
  verifyAdminToken,
  updateSellerCommission
);
router.get(
  "/getDetailsOFSingleUserForAdminCustomerDetailsComponent/:id",
  // verifyAdminToken,
  getDetailsOFSingleUserForAdminCustomerDetailsComponent
);

router.get("/check-user-email", verifyUserToken, checkUser_Email);
router.get("/checkStuff", verifyStuffToken, checkUser_Email);
router.get("/allOrdersOfUser", verifyUserToken, allOrdersOfUser);
router.get("/getSingleOrder/:id", verifyUserToken, getSingleOrder);
router.get("/allForAdminIndexPage", verifyAdminToken, allForAdminIndexPage);
router.get(
  "/allStuffForAdminIndexPage",
  verifyAdminToken,
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
router.post("/updateUserInfo/:userId", verifyUserToken, updateUser);
router.patch("/updateStatus/:id", verifyAdminToken, updateStatus);
router.patch("/updatePassword/:id", verifyAdminToken, updatePassword);
router.delete("/delete/:id", verifyAdminToken, deleteById(User));

export default router;
