import mongoose, { Schema, Document, Types } from "mongoose";

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
  paymentMethod: string;
  transactionId: string;
  totalAmount: number;
  offerDeadLine: string;
  createdAt: Date;
  updatedAt: Date;
  oneClickPayOrder: boolean;
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
    address: { type: String, required: true },
    phone: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    offerDeadLine: { type: String },
    oneClickPayOrder: { type: Boolean },
  },
  { timestamps: true }
);

// Export Model
export const SellerOrderModel = mongoose.model<SellerOrder>(
  "SellerOrder",
  SellerOrderSchema
);
