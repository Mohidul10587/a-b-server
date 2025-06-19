import mongoose, { Schema, model, Document, ObjectId } from "mongoose";

// Subcategory schema with subcategories
interface Subcategory extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  display: boolean;
  img: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  metaImg: string;
  position: number;
  parentCategory: mongoose.Types.ObjectId;
}

const SubcategorySchema = new Schema<Subcategory>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: { type: String },
    display: { type: Boolean },
    img: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: [String] },
    metaImg: { type: String },
    position: { type: Number, default: 0 },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to make the category slug unique if it's already taken
SubcategorySchema.pre("save", async function (next) {
  const doc = this as unknown as Subcategory;
  // Ensure the unique slug for Subcategory
  if (!doc.isModified("slug")) return next();
  let slug = doc.slug;
  let counter = 1;
  // Check if a category with the same slug already exists
  while (await mongoose.models.Subcategory.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }

  doc.slug = slug;

  next();
});

const Subcategory = model<Subcategory>("Subcategory", SubcategorySchema);
export default Subcategory;
