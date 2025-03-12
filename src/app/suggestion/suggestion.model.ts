import mongoose, { Schema, model, Document } from "mongoose";

interface ISuggestion extends Document {
  title: string;
  products: mongoose.Schema.Types.ObjectId[];
}

const SuggestionSchema = new Schema({
  title: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Suggestion = model<ISuggestion>("Suggestion", SuggestionSchema);

export default Suggestion;
