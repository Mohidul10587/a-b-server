// routes/user.routes.ts
import express from "express";
import {
  checkUser_Email,
  getSingleUser,
  updateUser,
  logOut,
  getOrdersByUserId,
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
  setRefreshToken,
  allUserForAdmin,
  updateSellerStatus,
  updateUserStatus,
  updateUserPassword,
} from "./user.controller";
import { verifyUserToken } from "./middlewares";

import { deleteById } from "../shared/reusableControllers";
import User from "./user.model";

import { verifyAdminToken, verifyStuffToken } from "./middlewares";

const router = express.Router();

//-----------------for user-----------------------------------

router.get("/getAuthenticatedUser", getAuthenticatedUser);
router.post("/logout", logOut);
router.get("/singleUser/:userId", getSingleUser);
router.get("/getSingleUserBySlug/:userSlug", getSingleUserBySlug);
router.get("/getSingleUserById/:id", getSingleUserById);
router.get("/sellerStatus/:userSlug", getStatus);
router.get("/singleForEditPage/:id", verifyUserToken, singleForEditPage);
router.get("/getSummaryOfActivity", verifyUserToken, getSummaryOfActivity);
router.put("/update/:id", verifyUserToken, update);

//-----------------for Admin-----------------------------------
router.get("/allUserForAdmin", allUserForAdmin);
router.patch(
  "/updateSellerStatusOfUser/:userId",
  verifyAdminToken,
  updateSellerStatus
);
router.patch(
  "/updateUserStatusOfUser/:userId",
  verifyAdminToken,
  updateUserStatus
);

router.patch(
  "/updateUserPassword/:userId",
  verifyAdminToken,
  updateUserPassword
);
router.get(
  "/getDetailsOFSingleUserForAdminCustomerDetailsComponent/:id",
  // verifyAdminToken,
  getDetailsOFSingleUserForAdminCustomerDetailsComponent
);

router.get("/check-user-email", verifyUserToken, checkUser_Email);
router.get("/checkStuff", verifyStuffToken, checkUser_Email);
router.get("/allOrdersOfUser", verifyUserToken, getOrdersByUserId);
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
// router.post(
//   "/createUserAsStuffByEmailAndPasswordByAdmin",
//   verifyAdminToken,
//   signUp
// );
router.post("/signUpByCredentials", signUpByCredentials);
router.post("/logInByCredentials", logInByCredentials);
router.post("/googleUpsertUser", googleUpsertUser);
router.post("/setCookie", setRefreshToken);

export default router;
