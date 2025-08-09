import { Request, Response } from "express";
import Wishlist from "./wishlist.model";
import mongoose from "mongoose";

export const addToWishlist = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req?.user?._id as string;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid userId or productId" });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId });

    // If no wishlist exists for the user, create a new one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: [{ product: productId, addedAt: new Date() }], // Add `addedAt` field
      });
    } else {
      // Check if the product is already in the wishlist
      const isProductInWishlist = wishlist.items.some(
        (item) => item.product.toString() === productId
      );
      if (isProductInWishlist) {
        return res
          .status(400)
          .json({ success: false, message: "Product already in wishlist" });
      }

      // Add the product to the wishlist
      wishlist.items.push({ product: productId, addedAt: new Date() }); // Add `addedAt` field
      await wishlist.save();
    }

    return res
      .status(200)
      .json({ success: true, wishlist, message: "Product added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove a product from the user's wishlist
export const deleteSingleFromWishlist = async (req: Request, res: Response) => {
  const { productId } = req.params;

  const userId = req?.user?._id as string;
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid userId or productId" });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    // Remove the product from the wishlist
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );
    await wishlist.save();

    return res.status(200).json({
      success: true,
      wishlist,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get the user's wishlist
export const getWishlist = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate(
      "items.product"
    );

    if (!wishlist) {
      return res.status(200).json({ message: "Wishlist not found" });
    }

    return res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Clear the user's wishlist
export const clearWishlist = async (req: Request, res: Response) => {
  const userId = req?.user?._id as string;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    return res
      .status(200)
      .json({ success: true, wishlist, message: "Wishlist cleared" });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
