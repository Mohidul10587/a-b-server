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
// import { uploadFields } from "../product/product.routes";
// import Stripe from "stripe";
// const stripe = new Stripe(
//   "sk_test_51MSFzbGk3QfbJiMcsqL1UPl95CGQ4zuA9vzlgYy8aodGEOs7jobqIhTQfdnH50XILCQVSJhL5kSDosjGgjT3ZV2v00SYnQOh85"
// );
const router = express.Router();

// Route to create a new user
router.post("/create", createUser);

router.get("/check-user-email", verifyUserToken, checkUser_Email);
router.post("/logout", logOut);
router.post("/logInWithEmailPassword", logInWithEmailPassword);
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

// router.post("/create-payment-intent", async (req, res) => {
//   const price = req.body.price;
//   const amount = price * 100;

//   const paymentIntent = await stripe.paymentIntents.create({
//     currency: "usd",
//     amount: amount,
//     payment_method_types: ["card"],
//   });
//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

router.post("/add-coins", addCoins);

export default router;
