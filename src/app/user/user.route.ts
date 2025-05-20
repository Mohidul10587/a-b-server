// routes/user.routes.ts
import express from "express";
import {
  createUserBySocialMethod,
  checkUser_Email,
  getSingleUser,
  updateUser,
  logOut,
  logInUserWithEmailPassword,
  getOrdersByUserId,
  getSingleUserBySlug,
  getContactInfoOfSingleUserBySlug,
  getStatus,
  getSingleOrder,
  addCoins,
  getSingleUserById,
  getSingleUserForAddToCartComponent,
  getAuthenticatedUser,
  createUserByEmailAndPassword,
  singleForEditPage,
  update,
  allForAdminIndexPage,
  updateStatus,
  createStuffByEmailAndPassword,
  allStuffForAdminIndexPage,
  logInStuffWithEmailPassword,
  getSummaryOfActivity,
  getDetailsOFSingleUserForAdminCustomerDetailsComponent,
  updatePassword,
  getCountsOfDocuments,
} from "./user.controller";
import { verifyUserToken } from "./middlewares";

import { deleteById } from "../shared/reusableControllers";
import User from "./user.model";

import { verifyAdminToken, verifyStuffToken } from "./middlewares";

const router = express.Router();

//-----------------for user-----------------------------------

router.post("/create", createUserBySocialMethod);
router.post("/createUserByEmailAndPassword", createUserByEmailAndPassword);
router.get("/getAuthenticatedUser", getAuthenticatedUser);
router.post("/logout", logOut);
router.post("/logInUserWithEmailPassword", logInUserWithEmailPassword);
router.post("/logInStuffWithEmailPassword", logInStuffWithEmailPassword);
router.get("/singleUser/:userId", getSingleUser);
router.get("/getSingleUserBySlug/:userSlug", getSingleUserBySlug);
router.get("/getSingleUserById/:id", getSingleUserById);
router.get("/sellerStatus/:userSlug", getStatus);
router.get("/singleForEditPage/:id", verifyUserToken, singleForEditPage);
router.get("/getSummaryOfActivity", verifyUserToken, getSummaryOfActivity);
router.post("/add-coins", addCoins);
router.put("/update/:id", verifyUserToken, update);

//-----------------for Admin-----------------------------------

router.post(
  "/createStuffByEmailAndPassword",
  verifyAdminToken,
  createStuffByEmailAndPassword
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
router.post(
  "/createUserAsStuffByEmailAndPasswordByAdmin",
  verifyAdminToken,
  createUserByEmailAndPassword
);
router.get("/getOrdersCount", getCountsOfDocuments);
export default router;
