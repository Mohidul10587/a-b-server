import express from "express";
import {
  addToWishlist,
  deleteSingleFromWishlist,
  getWishlist,
  clearWishlist,
} from "./wishlist.controller";
import { verUserTkn } from "../user/middlewares";

const router = express.Router();

// Route to add a product to the wishlist
router.post("/addToWishlist", verUserTkn, addToWishlist);

// Route to remove a product from the wishlist
router.delete("/deleteSingle/:productId", verUserTkn, deleteSingleFromWishlist);
router.delete("/deleteAll", verUserTkn, clearWishlist);

// Route to get the user's wishlist
router.get("/getWishlist", verUserTkn, getWishlist);

export default router;
