import mongoose, { Schema, model, Document } from "mongoose";

interface IPublishers extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  rating: number;
  img: string | null;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  metaImg: string | null;
  position: number;
  video: string;
  link: string;
}

const publishersSchema = new Schema<IPublishers>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: { type: String },
    rating: { type: Number, required: true },
    img: { type: String, default: null },
    metaTitle: { type: String }, // New field
    metaDescription: { type: String }, // New field
    keywords: { type: [String] }, // New field
    metaImg: { type: String, default: null },
    position: { type: Number, default: 0 },
    video: { type: String },
    link: { type: String, default: "#" },
  },
  { timestamps: true }
);

// Middleware to make the slug unique if it's already taken
publishersSchema.pre("save", async function (next) {
  const doc = this as unknown as IPublishers;

  if (!doc.isModified("slug")) return next();

  let slug = doc.slug;
  let counter = 1;

  // Check if a product with the same slug already exists
  while (await mongoose.models.Publisher.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }
  doc.slug = slug;
  next();
});

const Publisher = model<IPublishers>("Publisher", publishersSchema);
export default Publisher;
