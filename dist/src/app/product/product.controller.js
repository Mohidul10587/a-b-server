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
exports.createProduct = void 0;
const product_model_1 = __importDefault(require("./product.model"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
  cloud_name: "dpksjt1e3",
  api_key: "516976553864439",
  api_secret: "ycUtN1JCHtEskPWyJeL-OltqUaw",
});
const createProduct = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const {
      title,
      description,
      category,
      generalDetails,
      platformDetails,
      price,
      stockStatus,
      brand,
      featured,
      sele,
      condition,
      warranty,
      youtubeVideo,
      shippingInside,
      shippingOutside,
    } = req.body;
    const files = req.files;
    try {
      const photoFile =
        (_a = files === null || files === void 0 ? void 0 : files.photo) ===
          null || _a === void 0
          ? void 0
          : _a[0];
      const attachedFiles =
        (files === null || files === void 0 ? void 0 : files.attachedFiles) ||
        [];
      let img = "";
      if (photoFile) {
        const result = yield new Promise((resolve, reject) => {
          cloudinary_1.v2.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(photoFile.buffer);
        });
        img = result.secure_url;
      }
      const attachedFilesUrls = [];
      for (const file of attachedFiles) {
        const result = yield new Promise((resolve, reject) => {
          cloudinary_1.v2.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });
        attachedFilesUrls.push(result.secure_url);
      }
      const newProduct = new product_model_1.default({
        title,
        description,
        category,
        generalDetails,
        platformDetails,
        price,
        stockStatus,
        brand,
        featured,
        sele,
        condition,
        warranty,
        youtubeVideo,
        shippingInside,
        shippingOutside,
        photo: img,
        attachedFiles: attachedFilesUrls,
      });
      const savedProduct = yield newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
exports.createProduct = createProduct;
