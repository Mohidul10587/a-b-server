import { Schema, model, Types, Document } from "mongoose";
import { isObjectId } from "../shared/isObjectId";

export interface IPageElements extends Document {
  title: string;
  sections: {
    sectionTitle: string;
    link: string;
    status: boolean;
    titleLink: string;
    titleAlignment: "left" | "center" | "right";
    isTitle: string;
    desktopGrid: number;
    mobileGrid: number;
    margin: number;
    padding: number;
    titleTextColor: string;
    boxText: string;
    titleBgColor: string;
    boxBg: string;
    gridStyle: string;
    productStyle: string;
    postLimit: number;
    display: "both" | "desktop" | "mobile";
    imagePosition: "left" | "right" | "center";

    position: number;
    selectionType: string;
    banner: Types.ObjectId | null;
    category: Types.ObjectId | null;
    subcategory: Types.ObjectId | null;
    writer: Types.ObjectId | null;
    latest: any[];
    preOrder: any[];
    images: string[];
    width: number;
    height: number;
    suggestion: Types.ObjectId | null;
  }[];
}

const sectionSchema = new Schema(
  {
    sectionTitle: { type: String, required: true },
    link: { type: String, default: "" },
    status: { type: Boolean, required: true },
    titleLink: { type: String, default: "" },
    titleAlignment: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
    isTitle: { type: String, default: "true" },
    desktopGrid: { type: Number, default: 4 },
    mobileGrid: { type: Number, default: 1 },
    margin: { type: Number, default: 0 },
    padding: { type: Number, default: 0 },
    boxText: { type: String, default: "#ffffff" },
    titleTextColor: { type: String, default: "#ffffff" },
    boxBg: { type: String, default: "#ffffff" },
    titleBgColor: { type: String, default: "#ffffff" },
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
    position: { type: Number, required: true },
    selectionType: { type: String, required: true },
    banner: {
      type: Schema.Types.ObjectId,
      ref: "Banner",
      set: (v: string | null) => (isObjectId(v) ? v : null),
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      set: (v: string | null) => (isObjectId(v) ? v : null),
      default: null,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      set: (v: string | null) => (isObjectId(v) ? v : null),
      default: null,
    },
    suggestion: {
      type: Schema.Types.ObjectId,
      ref: "Suggestion",
      set: (v: string | null) => (isObjectId(v) ? v : null),
      default: null,
    },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "Writer",
      set: (v: string | null) => (isObjectId(v) ? v : null),
      default: null,
    },
    latest: { type: [], default: [] },
    preOrder: { type: [], default: [] },
    images: { type: [String], default: [] },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { _id: false }
);

const pageElementsSchema = new Schema<IPageElements>(
  {
    title: { type: String, required: true },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true }
);

export const PageElements = model<IPageElements>(
  "Elements",
  pageElementsSchema
);
