import mongoose, { Schema, model, Document } from "mongoose";

interface IWriter extends Document {
  title: string;
  slug: string;

  description: string;

  photo: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  metaImage: string;
}

const writerSchema = new Schema<IWriter>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },

  photo: { type: String, required: true },
  metaTitle: { type: String }, // New field
  metaDescription: { type: String }, // New field
  tags: { type: [String] }, // New field
  metaImage: { type: String },
});

// Middleware to make the slug unique if it's already taken
writerSchema.pre("save", async function (next) {
  const doc = this as unknown as IWriter;

  if (!doc.isModified("slug")) return next();

  let slug = doc.slug;
  let counter = 1;

  // Check if a product with the same slug already exists
  while (await mongoose.models.writer.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }

  doc.slug = slug;
  next();
});

const Writer = model<IWriter>("Writer", writerSchema);

export default Writer;
