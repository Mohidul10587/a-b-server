import express from "express";

import {
  createOrUpdate,
  addSingleItemToCart,
  updateProductQuantityInDataBase,
  getUserCart,
  removeItemFromCart,
  updateIsChecked,
} from "./cart.controller";
import { verifyUserToken } from "../user/middlewares";

const router = express.Router();

router.post("/create", createOrUpdate);
router.post("/addSingleItemToCart", addSingleItemToCart);
router.post(
  "/updateProductQuantityInDataBase",
  verifyUserToken,
  updateProductQuantityInDataBase
);

router.get("/getUserCart/:userId", getUserCart);

router.delete("/removeItemFromCart", verifyUserToken, removeItemFromCart);
router.patch("/update-isChecked", updateIsChecked);
export default router;
