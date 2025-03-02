import express from "express";

import {
  createOrUpdate,
  addSingleItemToCart,
  updateProductQuantityInDataBase,
  getUserCart,
  removeItemFromCart,
  updateIsChecked,
} from "./cart.controller";
import verifyUserToken from "../user/user.middleware";

const router = express.Router();

router.post("/create", verifyUserToken, createOrUpdate);
router.post("/addSingleItemToCart", addSingleItemToCart);
router.post(
  "/updateProductQuantityInDataBase",
  verifyUserToken,
  updateProductQuantityInDataBase
);

router.get("/getUserCart/:userId", verifyUserToken, getUserCart);
router.delete("/removeItemFromCart", verifyUserToken, removeItemFromCart);
router.patch("/update-isChecked", verifyUserToken, updateIsChecked);
export default router;
