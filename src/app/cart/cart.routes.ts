import express from "express";

import {
  createOrUpdate,
  addSingleItemToCart,
  updateProductQntInDb,
  getUserCart,
  removeItemFromCart,
  updateIsChecked,
  getUserCartQuantity,
} from "./cart.controller";
import { verifyUserToken } from "../user/middlewares";

const router = express.Router();

router.post("/create", createOrUpdate);
router.post("/addSingleItemToCart", addSingleItemToCart);
router.post("/updateProductQntInDb", verifyUserToken, updateProductQntInDb);

router.get("/getUserCart/:userId", getUserCart);
router.get("/getUserCartQuantity/:userId", getUserCartQuantity);

router.delete("/removeItemFromCart", verifyUserToken, removeItemFromCart);
router.patch("/update-isChecked", updateIsChecked);
export default router;
