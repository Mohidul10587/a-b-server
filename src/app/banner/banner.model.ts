import mongoose, { Document, Schema } from "mongoose";

interface BannerItem {
  img: string;
  title: string;
  link: string;
}

interface IBanner extends Document {
  title: string;
  banners: BannerItem[];
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    banners: [
      {
        img: { type: String },
        title: { type: String },
        link: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Banner = mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
