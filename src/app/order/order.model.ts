// models/Order.ts
import mongoose, { ObjectId, Schema, Document } from "mongoose";
import { CartItemSchema, ICart } from "../cart/cart.model";

interface IOrder extends Document {
  cart: ICart[];
  user: ObjectId;
  deliveryInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: boolean;
  paymentTnxId: string;
  status: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    cart: [CartItemSchema],
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    deliveryInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paidAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: Boolean, default: false },
    paymentTnxId: { type: String, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
