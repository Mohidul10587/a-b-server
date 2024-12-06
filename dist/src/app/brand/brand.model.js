"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  photo: { type: String, required: true },
});
const Writer = (0, mongoose_1.model)("Writer", brandSchema);
exports.default = Writer;
