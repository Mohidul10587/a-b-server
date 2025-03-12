import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
}

const adminSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
});

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
