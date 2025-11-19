// models/Order.ts
import mongoose, { ObjectId, Schema, Document } from "mongoose";
import { CartItemSchema, ICart } from "../cart/cart.model";

interface IOrder extends Document {
  cart: ICart[];
  user: ObjectId;
  deliveryInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    receiverName: string;
    receiverPhone: string;
    deliveryType: "Post Office" | "Courier";
    district?: string;
    thana?: string;
    village?: string;
    postOffice?: string;
    postalCode?: string;
    courierAddress?: string;
  };
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: boolean;
  paymentTnxId: string;
  status: "Pending" | "Delivered" | "Cancelled" | "Returned";
}

const OrderSchema = new Schema<IOrder>(
  {
    cart: [CartItemSchema],
    user: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    deliveryInfo: {
      name: { type: String, required: true },
      email: { type: String },
      address: { type: String },
      phone: { type: String, required: true },
      receiverName: { type: String },
      receiverPhone: { type: String },
      deliveryType: { type: String },
      district: { type: String },
      thana: { type: String },
      village: { type: String },
      postOffice: { type: String },
      postalCode: { type: String },
      courierAddress: { type: String },
    },
    paidAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: Boolean, default: false },
    paymentTnxId: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled", "Returned"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
