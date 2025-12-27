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
import { verUserTkn } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Cart from "./cart.model";

const router = express.Router();

router.post("/create", createOrUpdate);
router.post("/addSingleItemToCart", addSingleItemToCart);
router.post("/updateProductQntInDb", verUserTkn, updateProductQntInDb);

router.get("/getUserCart/:userId", getUserCart);
router.get("/getUserCartQuantity/:userId", getUserCartQuantity);

router.delete("/removeItemFromCart", verUserTkn, removeItemFromCart);
router.patch("/update-isChecked", updateIsChecked);
router.delete("/delete/:id", deleteById(Cart));
export default router;
