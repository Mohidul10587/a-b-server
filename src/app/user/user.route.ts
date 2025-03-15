// routes/user.routes.ts
import express from "express";
import {
  createUser,
  checkUser_Email,
  getAllUsers,
  getSingleUser,
  updateUser,
  logOut,
  createUserByEmailAndPassword,
  logInWithEmailPassword,
  getOrdersByUserId,
  getSingleUserBySlug,
  getContactInfoOfSingleUserBySlug,
  getStatus,
  getSingleOrder,
  addCoins,
  getSingleUserById,
  getSingleUserForAddToCartComponent,
} from "./user.controller";
import verifyUserToken from "./user.middleware";

const router = express.Router();

// Route to create a new user
router.post("/create", createUser);
router.post("/logInWithEmailPassword", logInWithEmailPassword);
router.get("/check-user-email", verifyUserToken, checkUser_Email);
router.post("/logout", logOut);

router.post("/signUpWithEmailPassword", createUserByEmailAndPassword);
router.post("/logout", logOut);
router.get("/allOrdersOfUser", verifyUserToken, getOrdersByUserId);
router.get("/getSingleOrder/:id", verifyUserToken, getSingleOrder);

router.get("/all", getAllUsers);
router.get("/singleUser/:userId", getSingleUser);
router.get("/getSingleUserBySlug/:userSlug", getSingleUserBySlug);
router.get("/getSingleUserById/:id", getSingleUserById);
router.get("/sellerStatus/:userSlug", getStatus);
router.get(
  "/getContactInfoOfSingleUserBySlug/:userSlug",
  getContactInfoOfSingleUserBySlug
);
router.get(
  "/getSingleUserForAddToCartComponent/:id",
  getSingleUserForAddToCartComponent
);
router.post(
  "/updateUserInfo/:userId",
  verifyUserToken,

  updateUser
);

router.post("/add-coins", addCoins);

export default router;
