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
exports.getAllWriterIds =
  exports.deleteWriter =
  exports.updateWriter =
  exports.getAllWriters2 =
  exports.getWriterById =
  exports.getAllWriters =
  exports.createWriter =
    void 0;
const brand_model_1 = __importDefault(require("./brand.model"));
const product_model_1 = __importDefault(require("../product/product.model"));
const cloudinary_config_1 = __importDefault(
  require("../shared/cloudinary.config")
);
const createWriter = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (req.file && req.file.path) {
        const result = yield cloudinary_config_1.default.uploader.upload(
          req.file.path
        );
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
      // Fetch all brands
      const previousWriters = yield brand_model_1.default.find();
      // Fetch products and count products per brand
      const brands = yield Promise.all(
        previousWriters.map((brand) =>
          __awaiter(void 0, void 0, void 0, function* () {
            const productCount = yield product_model_1.default.countDocuments({
              brand: brand._id,
            });
            return Object.assign(Object.assign({}, brand.toJSON()), {
              brandProducts: productCount,
            });
          })
        )
      );
      res.status(200).json({ brands });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
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
const getAllWriters2 = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const brands = yield brand_model_1.default
        .find()
        .select("_id title")
        .lean();
      res.status(200).send(brands);
    } catch (err) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
exports.getAllWriters2 = getAllWriters2;
const updateWriter = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const brand = yield brand_model_1.default.findById(req.params.id);
      if (!brand) {
        res.status(404).send({ error: "Writer not found" });
        return;
      }
      if (req.file && req.file.path) {
        const result = yield cloudinary_config_1.default.uploader.upload(
          req.file.path
        );
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
// Function to get all brand IDs
const getAllWriterIds = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const brandIds = yield brand_model_1.default.find().select("_id").lean();
      // Extract the _id field from each brand and return an array of IDs
      const ids = brandIds.map((brand) => brand._id);
      res.status(200).json(ids);
    } catch (err) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  });
exports.getAllWriterIds = getAllWriterIds;
