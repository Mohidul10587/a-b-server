// models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  cart: {
    id: Schema.Types.ObjectId;
    quantity: number;
  }[];
  deliveryInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
  status: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    cart: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    deliveryInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
