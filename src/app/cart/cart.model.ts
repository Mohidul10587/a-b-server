import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface ICartItem {
  _id: ObjectId;
  img: string;
  sellingPrice: number;
  // seller: ObjectId;
  title: string;
  shippingInside?: number;
  shippingOutside?: number;
  quantity: number;
  isChecked: boolean;
  existingQnt: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  cartItems: ICartItem[]; // Corrected field name to `cartItems`
}

export const CartItemSchema = new Schema<ICartItem>({
  _id: { type: Schema.Types.ObjectId, ref: "Product" },
  img: { type: String, required: true },
  // seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sellingPrice: { type: Number, required: true },
  title: { type: String },
  shippingInside: { type: Number },
  shippingOutside: { type: Number },
  quantity: { type: Number, required: true },
  existingQnt: { type: Number, required: true },
  isChecked: { type: Boolean, default: true },
});

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: { type: [CartItemSchema], default: [] }, // Embedded array of cart items
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Cart = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
