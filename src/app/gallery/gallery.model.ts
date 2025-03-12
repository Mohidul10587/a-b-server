import mongoose, { Schema, Document } from "mongoose";

// Define the interface for Meta
export interface IMeta extends Document {
  title: string;
  img: string;
  useCase:
    | "product"
    | "category"
    | "subcategory"
    | "childCategory"
    | "brand"
    | "logo"
    | "banner"
    | "popup"
    | "others";
}

// Create Meta Schema
const GallerySchema: Schema = new Schema(
  {
    title: { type: String, required: true }, // Title is now required
    img: { type: String, required: true }, // Image is now required
    useCase: {
      type: String,
      enum: [
        "product",
        "category",
        "subcategory",
        "childCategory",
        "brand",
        "logo",
        "banner",
        "popup",
        "others",
      ],
      required: true,
      default: "others", // useCase is now required
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Export the model
const Gallery = mongoose.model<IMeta>("Gallery", GallerySchema);
export default Gallery;
