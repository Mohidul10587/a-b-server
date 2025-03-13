"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWriter =
  exports.updateWriter =
  exports.getWriterById =
  exports.getAllWriters =
  exports.createWriter =
    void 0;
const brand_model_1 = __importDefault(require("./brand.model"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
  cloud_name: "dpksjt1e3",
  api_key: "516976553864439",
  api_secret: "ycUtN1JCHtEskPWyJeL-OltqUaw",
});
const createWriter = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (req.file && req.file.path) {
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
        const brand = new brand_model_1.default({
          title: req.body.title,
          description: req.body.description,
          rating: req.body.rating,
          photo: result.secure_url,
        });
        yield brand.save();
        res.status(200).send({ brand });
      } else {
        throw new Error("No file provided");
      }
    } catch (err) {
      
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
exports.createWriter = createWriter;
const getAllWriters = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const brands = yield brand_model_1.default.find();
      res.status(200).send({ brands });
    } catch (err) {
      
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
exports.getAllWriters = getAllWriters;
const getWriterById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const brand = yield brand_model_1.default.findById(req.params.id);
      if (!brand) {
        res.status(404).send({ error: "Writer not found" });
        return;
      }
      res.status(200).send({ brand });
    } catch (err) {
      
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
exports.getWriterById = getWriterById;
const updateWriter = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const brand = yield brand_model_1.default.findById(req.params.id);
      if (!brand) {
        res.status(404).send({ error: "Writer not found" });
        return;
      }
      if (req.file && req.file.path) {
        const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
        brand.photo = result.secure_url;
      }
      brand.title = req.body.title || brand.title;
      brand.description = req.body.description || brand.description;
      brand.rating = req.body.rating || brand.rating;
      yield brand.save();
      res.status(200).send({ brand });
    } catch (err) {
      
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
exports.updateWriter = updateWriter;
const deleteWriter = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const brand = yield brand_model_1.default.findByIdAndDelete(
        req.params.id
      );
      if (!brand) {
        res.status(404).send({ error: "Writer not found" });
        return;
      }
      res.status(200).send({ message: "Writer deleted successfully" });
    } catch (err) {
      
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
exports.deleteWriter = deleteWriter;
