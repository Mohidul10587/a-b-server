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
  suggestion: Schema.Types.ObjectId | null;
  youtubeVideo: string;
  shippingInside: number;
  shippingOutside: number;
  metaTitle: string;
  metaDescription: string;
  publisher: Schema.Types.ObjectId | null;
  summary: string;
  numberOfPage: number;
  rating: number;

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
    rating: { type: Number, default: 3.5 },

    metaImage: { type: String, default: "" },
    attachedFiles: { type: [String], default: [] },
    suggestion: {
      type: Schema.Types.ObjectId,
      ref: "Suggestion",
      default: null,
    },
  },
  { timestamps: true }
);

// Model

// Middleware to make the slug unique if it's already taken
ProductSchema.pre("save", async function (next) {
  const doc = this as unknown as IProduct;

  if (!doc.isModified("slug")) return next();

  let slug = doc.slug;
  let counter = 1;

  // Check if a product with the same slug already exists
  while (await mongoose.models.Product.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }

  doc.slug = slug;
  next();
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
