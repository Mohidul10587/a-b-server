import mongoose, { Schema, Document, Types } from "mongoose";
import { isObjectId } from "../shared/isObjectId";

// Product Interface
interface Product {
  _id: Types.ObjectId;
  title: string;
  sellingPrice: number;
  img: string;
  seller: Types.ObjectId;
  commissionForSeller: number;
  quantity: number;
  transactionId: string;
}

// Seller Order Interface
export interface SellerOrder extends Document {
  sellerId: Types.ObjectId;
  products: Product[];
  name: string;
  address: string;
  phone: string;
  shippingMethod: string;
  status: string;
  userId: Types.ObjectId;
  receiverName: string;
  receiverPhone: string;
  deliveryType: "Post Office" | "Courier";
  district?: string;
  thana?: string;
  village?: string;
  postOffice?: string;
  postalCode?: string;
  courierAddress?: string;
  paymentMethod: string;
  transactionId: string;
  totalAmount: number;

  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema = new Schema<Product>(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    img: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    commissionForSeller: { type: Number, required: true },
    quantity: { type: Number, required: true },
    transactionId: { type: String, required: true },
  },
  { _id: false } // Disable automatic _id for subdocuments
);

// Seller Order Schema
const SellerOrderSchema = new Schema<SellerOrder>(
  {
    sellerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    products: { type: [ProductSchema], required: true },
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    status: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      set: (value: string | null) => (isObjectId(value) ? value : null),
      default: null,
      ref: "User",
    },
    receiverName: { type: String },
    receiverPhone: { type: String },
    deliveryType: { type: String },
    district: { type: String },
    thana: { type: String },
    village: { type: String },
    postOffice: { type: String },
    postalCode: { type: String },
    courierAddress: { type: String },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Export Model
export const SellerOrderModel = mongoose.model<SellerOrder>(
  "SellerOrder",
  SellerOrderSchema
);
