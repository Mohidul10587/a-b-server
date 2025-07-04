import mongoose from "mongoose";

export const isObjectId = (value: any) =>
  mongoose.Types.ObjectId.isValid(value);
