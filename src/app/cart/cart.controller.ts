import { Request, Response } from "express";
import Cart from "./cart.model";
import User from "../user/user.model";

export const createOrUpdate = async (req: Request, res: Response) => {
  try {
    const { userId, cartItems } = req.body;
    if (!userId || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find the cart for the user
    let cart: InstanceType<typeof Cart> | null = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({ userId, cartItems });
    } else {
      // Loop through the new cart items
      cartItems.forEach((newItem) => {
        const existingItemIndex = cart!.cartItems.findIndex(
          (item) => item.variantId === newItem.variantId
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item already exists
          cart!.cartItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          // Add new item to cart only if it's not already there
          cart!.cartItems.push(newItem);
        }
      });

      // Ensure cartItems don't have duplicates
      cart!.cartItems = Array.from(
        new Map(cart!.cartItems.map((item) => [item.variantId, item])).values()
      );
    }

    // Save the cart after updates
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addSingleItemToCart = async (req: Request, res: Response) => {
  try {
    const { userId, cartItem } = req.body;
    console.log(cartItem);
    if (!userId || !cartItem || typeof cartItem !== "object") {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find or create the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, cartItems: [cartItem] });
    } else {
      const existingItemIndex = cart.cartItems.findIndex(
        (item) => item.variantId === cartItem.variantId
      );

      if (existingItemIndex !== -1) {
        // Increase quantity if item exists
        cart.cartItems[existingItemIndex].quantity += cartItem.quantity;
      } else {
        // Add new item to cart
        cart.cartItems.push(cartItem);
      }
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding item to cart", error });
  }
};

export const updateProductQuantityInDataBase = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, productId, variantId, operationType } = req.body;

    if (!userId || !productId || !variantId || !operationType) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.cartItems.findIndex(
      (item) =>
        item._id.toString() === productId && item.variantId === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity based on the operation type
    if (operationType === "increase") {
      cart.cartItems[itemIndex].quantity += 1;
    } else if (operationType === "decrease") {
      if (cart.cartItems[itemIndex].quantity > 1) {
        cart.cartItems[itemIndex].quantity -= 1;
      } else {
        // Remove item from cart if quantity becomes 0
        cart.cartItems.splice(itemIndex, 1);
      }
    } else {
      return res.status(400).json({ message: "Invalid operation type" });
    }

    // Save the updated cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Item quantity updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating item quantity", error });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Get userId from the query parameter

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the cart for the given userId
    const cart = await Cart.findOne({ userId });

    // Return the user's cart data
    res.status(200).json({
      message: "Cart fetched successfully",
      respondedData: cart?.cartItems || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, variantId } = req.body;

    if (!userId || !productId || !variantId) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find the user's carts
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to be removed
    const updatedCartItems = cart.cartItems.filter(
      (item) =>
        !(item._id.toString() === productId && item.variantId === variantId)
    );

    // Update cart items
    cart.cartItems = updatedCartItems;
    await cart.save();

    res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing item from cart", error });
  }
};

export const updateIsChecked = async (req: Request, res: Response) => {
  try {
    const { userId, variantId, isChecked } = req.body;

    if (!userId || !variantId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "cartItems.variantId": variantId },
      { $set: { "cartItems.$.isChecked": isChecked } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    res
      .status(200)
      .json({ message: "isChecked updated successfully", cart: updatedCart });
  } catch (error) {
    console.error("Error updating isChecked:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
