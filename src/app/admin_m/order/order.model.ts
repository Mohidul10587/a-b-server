import { Schema, model, Document } from "mongoose";

interface CheckoutDocument extends Document {
  name: string;
  address: string;
  location: string;
  phoneNumber: string;
  products: Schema.Types.ObjectId[]; // Update this to an array
  shippingCost: number;
  totalPrice: number;
  selectedShipping: string;
  selectedDeliveryOption: string;
  variantTitle: string;
  variantSectionTitle: string;
  status: string;
  createdAt: Date;
}

const checkoutSchema = new Schema<CheckoutDocument>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Updated field
    shippingCost: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    selectedShipping: { type: String, required: true },
    selectedDeliveryOption: { type: String, required: true },
    variantTitle: { type: String },
    variantSectionTitle: { type: String },
    status: { type: String, required: true },
  },
  { timestamps: true } // Enable timestamps
);

const Order = model<CheckoutDocument>("Order", checkoutSchema);

export default Order;
