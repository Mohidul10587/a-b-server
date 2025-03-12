import mongoose, { Schema, model, Document, ObjectId } from "mongoose";

// Category schema with subcategories
interface Category extends Document {
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
  subcategories: ObjectId[];

  queAndAnsArray: {
    title: string;
    description: string;
  }[];
}

const CategorySchema = new Schema<Category>({
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
  subcategories: {
    type: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
    default: [],
  },

  queAndAnsArray: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],
});

// Middleware to make the category slug unique if it's already taken
CategorySchema.pre("save", async function (next) {
  const doc = this as unknown as Category;
  // Ensure the unique slug for Category
  if (!doc.isModified("slug")) return next();
  let slug = doc.slug;
  let counter = 1;
  // Check if a category with the same slug already exists
  while (await mongoose.models.Category.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }

  doc.slug = slug;

  next();
});

const Category = model<Category>("Category", CategorySchema);
export default Category;
