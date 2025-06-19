import { Schema, model, Types, Document } from "mongoose";

export interface IPageElements extends Document {
  targetedPageId: string; // New field added
  sectionTitle: string;
  link: string;
  status: boolean;
  titleLink: string;
  titleAlignment: "left" | "center" | "right";
  isTitle: boolean;
  desktopGrid: number;
  mobileGrid: number;
  margin: number;
  padding: number;
  titleBackgroundColor: string;
  boxText: string;
  sectionBackgroundColor: string;
  boxBg: string;
  gridStyle: string;
  productStyle: string;
  postLimit: number;
  display: "both" | "desktop" | "mobile";
  imagePosition: "left" | "right" | "center";
  page: string;
  position: number;
  selectionType: string;
  bannerId: Types.ObjectId | null; // Reference to the banner ID
  productSectionId: string; // Reference to product section ID
  images: string[]; // Array of image URLs
  width: number;
  height: number;
  suggestionId: Types.ObjectId | null;
}

const pageElementsSchema = new Schema<IPageElements>(
  {
    targetedPageId: { type: String, required: true },
    sectionTitle: { type: String, required: true },
    link: { type: String },
    status: { type: Boolean, required: true },
    titleLink: { type: String, default: "" },
    titleAlignment: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
    isTitle: { type: Boolean, default: true },
    desktopGrid: { type: Number, default: 4 },
    mobileGrid: { type: Number, default: 1 },
    margin: { type: Number, default: 0 },
    padding: { type: Number, default: 0 },
    boxText: { type: String, default: "#ffffff" },
    titleBackgroundColor: { type: String, default: "#ffffff" },
    boxBg: { type: String, default: "#ffffff" },
    sectionBackgroundColor: { type: String, default: "#ffffff" },
    gridStyle: { type: String, default: "1" },
    productStyle: { type: String, default: "1" },
    postLimit: { type: Number, default: 10 },
    display: {
      type: String,
      enum: ["both", "desktop", "mobile"],
      default: "both",
    },
    imagePosition: {
      type: String,
      enum: ["left", "right", "center"],
      default: "left",
    },
    page: { type: String, required: true },
    position: { type: Number, required: true },
    selectionType: { type: String, required: true },
    bannerId: { type: Schema.Types.ObjectId, ref: "Banner", default: null }, // Reference to banner
    suggestionId: {
      type: Schema.Types.ObjectId,
      ref: "Suggestion",
      default: null,
    }, // Reference to banner

    productSectionId: {
      type: String,
      required: false,
    },
    images: { type: [String], default: [] }, // Array of image URLs
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { timestamps: true }
);

export const PageElements = model<IPageElements>(
  "Elements",
  pageElementsSchema
);
