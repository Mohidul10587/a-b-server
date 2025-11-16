import mongoose, { Schema, Document } from "mongoose";
import { isObjectId } from "../shared/isObjectId";

// Interface
export interface IProduct extends Document {
  attachedImgs: string[];
  binding: string;
  category: Schema.Types.ObjectId;
  description: string;
  display: boolean;
  edition: string;
  existingQnt: number;
  img: string;
  ISBN: string;
  keywords: string[];
  language: string;
  metaDescription: string;
  metaImg: string;
  metaTitle: string;
  numberOfPage: number;
  orderType: "Buy_Now" | "Pre_Order";
  productType: string;
  rating: number;
  regularPrice: number;
  seller: Schema.Types.ObjectId;
  sellingPrice: number;
  shortDescription: string;
  slug: string;
  stockStatus: string;
  subcategory: Schema.Types.ObjectId;
  subTitle: string;
  suggestion: Schema.Types.ObjectId | null;
  summary: string;
  titleBn: string;
  title: string;
  translator: string;
  writer: Schema.Types.ObjectId;
  youtubeVideo: string[];
  enabledByAdmin: boolean;
}

// Schema
const ProductSchema = new Schema<IProduct>(
  {
    enabledByAdmin: { type: Boolean, default: true },
    // A
    attachedImgs: { type: [String], default: [] },

    // B
    binding: { type: String },

    // C
    category: {
      type: Schema.Types.ObjectId,
      set: (value: string | null) => (isObjectId(value) ? value : null),
      ref: "Category",
      default: null,
    },

    // D
    description: { type: String },
    display: { type: Boolean, default: true },

    // E
    edition: { type: String },
    existingQnt: { type: Number, default: 100 },

    // I
    img: { type: String },
    ISBN: { type: String },

    // K
    keywords: { type: [String], default: [] },

    // L
    language: { type: String },

    // M
    metaDescription: { type: String, default: "" },
    metaImg: { type: String, default: "" },
    metaTitle: { type: String, default: "" },

    // N
    numberOfPage: { type: Number },

    // O
    orderType: {
      type: String,
      enum: ["Buy_Now", "Pre_Order"],
      default: "Buy_Now",
    },

    // P
    productType: { type: String },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // R
    rating: { type: Number, default: 3.5 },
    regularPrice: { type: Number },

    // S
    sellingPrice: { type: Number },

    shortDescription: { type: String },
    slug: { type: String, required: true, unique: true },
    stockStatus: { type: String },
    subcategory: {
      type: Schema.Types.ObjectId,
      set: (value: string | null) => (isObjectId(value) ? value : null),
      ref: "Subcategory",
      default: null,
    },
    subTitle: { type: String, default: "" },
    suggestion: {
      type: Schema.Types.ObjectId,
      set: (value: string | null) => (isObjectId(value) ? value : null),
      ref: "Suggestion",
      default: null,
    },

    // T
    titleBn: { type: String, default: "" },
    title: { type: String, required: true },
    translator: { type: String, default: "" },

    // W
    writer: {
      type: Schema.Types.ObjectId,
      set: (value: string | null) => (isObjectId(value) ? value : null),
      ref: "Writer",
      default: null,
    },

    // Y
    youtubeVideo: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Slug uniqueness middleware
ProductSchema.pre("save", async function (next) {
  const doc = this as unknown as IProduct;

  if (!doc.isModified("slug")) return next();

  let slug = doc.slug;
  let counter = 1;

  while (await mongoose.models.Product.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }

  doc.slug = slug;
  next();
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
