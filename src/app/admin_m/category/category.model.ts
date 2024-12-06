import mongoose, { Schema, model, Document, ObjectId } from "mongoose";

export interface Subcategory {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  photo: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  metaImage: string;
  position: number;
}
const SubcategorySchema = new Schema<Subcategory>({
  title: { type: String, required: true },
  slug: { type: String },
  photo: { type: String, required: true },
  description: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  tags: { type: [String] },
  metaImage: { type: String },
  position: { type: Number, default: 0 },
});
// Category schema with subcategories
interface Category extends Document {
  categoryName: string;
  slug: string;
  description: string;

  photoUrl: string;
  subCategories?: Subcategory[];
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  metaImage: string;
  position: number;
}

const CategorySchema = new Schema<Category>({
  categoryName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },

  photoUrl: { type: String, required: true },
  subCategories: [SubcategorySchema],
  metaTitle: { type: String },
  metaDescription: { type: String },
  tags: { type: [String] },
  metaImage: { type: String },
  position: { type: Number, default: 0 },
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

  // Ensure each subcategory has a unique slug within the context of the category
  for (let i = 0; i < (doc.subCategories?.length || 0); i++) {
    let subcategorySlug = doc.subCategories![i].slug;
    let subCounter = 1;

    // Check if a subcategory with the same slug exists in the current category
    while (
      doc.subCategories?.some(
        (sub, index) => sub.slug === subcategorySlug && index !== i
      )
    ) {
      subcategorySlug = `${doc.subCategories![i].slug}-${subCounter++}`;
    }

    doc.subCategories![i].slug = subcategorySlug;
  }

  next();
});

const Category = model<Category>("Category", CategorySchema);
export default Category;
