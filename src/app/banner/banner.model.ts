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
    title: { type: String },

    banners: [
      {
        img: { type: String, required: true },
        title: { type: String },
        link: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Banner = mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
