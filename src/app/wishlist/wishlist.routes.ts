import express from "express";
import {
  addToWishlist,
  deleteSingleFromWishlist,
  getWishlist,
  clearWishlist,
} from "./wishlist.controller";
import { verifyUserToken } from "../user/middlewares";

const router = express.Router();

// Route to add a product to the wishlist
router.post("/addToWishlist", verifyUserToken, addToWishlist);

// Route to remove a product from the wishlist
router.delete(
  "/deleteSingle/:productId",
  verifyUserToken,
  deleteSingleFromWishlist
);
router.delete("/deleteAll", verifyUserToken, clearWishlist);

// Route to get the user's wishlist
router.get("/getWishlist", verifyUserToken, getWishlist);

export default router;
