import mongoose, { Schema, model, Document } from "mongoose";

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date; // Ensure `addedAt` is defined
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
}

const wishlistItemSchema = new Schema<IWishlistItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  addedAt: { type: Date, required: true, default: Date.now },
});

const wishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [wishlistItemSchema],
});

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
