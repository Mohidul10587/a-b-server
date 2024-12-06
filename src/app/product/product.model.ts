import mongoose, { Schema, Document } from "mongoose";

// Interface
export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Schema.Types.ObjectId | null;
  subCategory: Schema.Types.ObjectId | null;
  price: number;
  unprice: number;
  stockStatus: string;
  writer: Schema.Types.ObjectId | null;
  youtubeVideo: string;
  shippingInside: number;
  shippingOutside: number;
  metaTitle: string;
  metaDescription: string;
  publisher: Schema.Types.ObjectId | null;
  summary: string;
  numberOfPage: number;
  ISBN: string;
  edition: string;
  productType: string;
  translatorName: string;
  binding: string;
  language: string;
  orderType: string;
  titleEnglish: string;
  subTitle: string;
  tags: string[];
  photo: string;
  metaImage: string;
  attachedFiles: string[];
}

// Schema
const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
    price: { type: Number },
    unprice: { type: Number },
    stockStatus: { type: String },
    writer: { type: Schema.Types.ObjectId, ref: "Writer", default: null },
    youtubeVideo: { type: String, default: "" },
    shippingInside: { type: Number },
    shippingOutside: { type: Number },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    publisher: { type: Schema.Types.ObjectId, ref: "Publisher", default: null },
    summary: { type: String, default: "" },
    numberOfPage: { type: Number },
    ISBN: { type: String },
    edition: { type: String },
    productType: { type: String },
    translatorName: { type: String, default: "" },
    binding: { type: String },
    language: { type: String },
    orderType: { type: String },
    titleEnglish: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    tags: { type: [String], default: [] },
    photo: { type: String },
    metaImage: { type: String, default: "" },
    attachedFiles: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Model
const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
