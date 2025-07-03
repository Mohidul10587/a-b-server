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
exports.getProductsByPublishersSlug =
  exports.getProductsByCategorySlug =
  exports.getProductsByCategory2 =
  exports.getProductsByCategory =
  exports.getProductsByWriter =
  exports.getProductsByWriterSlug =
  exports.deleteProduct =
  exports.getAllProductsForOfferPage =
  exports.getAllProductsForAdmin =
  exports.getSingleProduct =
  exports.getAllProducts =
  exports.getProductDetails =
  exports.update =
  exports.create =
    void 0;
const product_model_1 = __importDefault(require("./product.model"));
const writer_model_1 = __importDefault(
  require("../admin_m/writer/writer.model")
);
const category_model_1 = __importDefault(
  require("../admin_m/category/category.model")
);
const publishers_model_1 = __importDefault(
  require("../admin_m/publishers/publishers.model")
);
const generateSLug_1 = require("../shared/generateSLug");
const create = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const data = req.body;
      const newProduct = yield product_model_1.default.create(
        Object.assign(Object.assign({}, data), {
          slug: (0, generateSLug_1.generateSlug)(data.title),
        })
      );
      // Send success message along with the created product data
      res.status(201).json({
        message: "Created successfully!",
        respondedData: newProduct, // Optionally, include the created product in the response
      });
    } catch (error) {
      // Send error message if there was an issue
      res.status(500).json({
        message: "Failed to create.",
        error: error.message,
      });
    }
  });
exports.create = create;
// Update
const update = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { id } = req.params;
      const updatedItem = yield product_model_1.default.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true, // Return the updated document
          runValidators: true, // Run validation on the updated data
        }
      );
      if (!updatedItem) {
        return res.status(404).json({
          message: "Not found.",
        });
      }
      res.status(200).json({
        message: "Updated successfully!",
        respondedData: updatedItem,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update.",
        error: error,
      });
    }
  });
exports.update = update;
const getProductDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Step 1: Find the product by slug
      const product = yield product_model_1.default
        .findOne({ slug: req.params.slug })
        .populate({
          path: "writer",
          model: "Writer",
          select: "title img slug", // Include only the 'name' field of the brand
        })
        .populate({
          path: "suggestion",
          model: "Suggestion",
          populate: {
            path: "products",
            model: "Product",
            select: "title img slug sellingPrice  rating",
            populate: {
              path: "writer",
              model: "Writer",
              select: "title",
            },
          },
          select: "title", // Include only the 'title' field of the category
        })
        .populate({
          path: "category",
          model: "Category",
          select: "title slug", // Include only the 'title' field of the category
        });
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      const categoryProducts = yield product_model_1.default.aggregate([
        {
          $match: {
            // @ts-expect-error: Suppressing error for type mismatch in `_id`
            category: product.category._id,
            _id: { $ne: product._id },
          },
        },
        {
          $sample: {
            size: 10, // Randomly select 10 products
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            writer: 1,
            sellingPrice: 1,
            rating: 1,
            regularPrice: 1,
            img: 1,
            slug: 1,
            stockStatus: 1,
          },
        },
      ]);
      // Step 3: Respond with the product and suggestion data
      res.status(200).json(
        Object.assign(Object.assign({}, product.toObject()), {
          // subcategory: subcategory || {},
          // suggestion: suggestionData,
          productsOfSameCategory: categoryProducts,
        })
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getProductDetails = getProductDetails;
const getAllProducts = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield product_model_1.default
        .find()
        .select("_id img title featured sele sellingPrice")
        .populate("writer")
        .populate("category");
      const products = result.reverse();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getAllProducts = getAllProducts;
const getSingleProduct = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const product = yield product_model_1.default
        .findOne({ _id: req.params.productId })
        .populate("writer")
        .populate("category");
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getSingleProduct = getSingleProduct;
const getAllProductsForAdmin = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield product_model_1.default
        .find()
        .select("_id img title sellingPrice slug")
        .populate("writer", "title");
      const products = result.reverse();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getAllProductsForAdmin = getAllProductsForAdmin;
const getAllProductsForOfferPage = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield product_model_1.default
        .find()
        .select("_id img title sellingPrice slug subcategory ")
        .populate("writer", "title")
        .populate("category", "title");
      const products = result.reverse();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getAllProductsForOfferPage = getAllProductsForOfferPage;
const deleteProduct = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
      const result = yield product_model_1.default.deleteOne({
        _id: productId,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.deleteProduct = deleteProduct;
const getProductsByWriterSlug = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
      const writer = yield writer_model_1.default.find({ slug });
      const result = yield product_model_1.default
        .find({ writer })
        .select(
          "_id img title featured sele sellingPrice slug category subcategory publisher language"
        );
      const products = result.reverse();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getProductsByWriterSlug = getProductsByWriterSlug;
const getProductsByWriter = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const writerId = req.params.writerId;
    try {
      const result = yield product_model_1.default
        .find({ writer: writerId })
        .select("_id img title featured sele sellingPrice slug")
        .populate("writer")
        .populate("category");
      const products = result.reverse();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getProductsByWriter = getProductsByWriter;
const getProductsByCategory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    const notIncludeProductId = req.params.notIncludeProductId;
    try {
      const products = yield product_model_1.default
        .find({
          category: categoryId,
          _id: { $ne: notIncludeProductId },
        })
        .populate("writer")
        .populate("category");
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getProductsByCategory = getProductsByCategory;
const getProductsByCategory2 = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
      const products = yield product_model_1.default
        .find({
          category: categoryId,
        })
        .populate("writer")
        .populate("category");
      res.status(200).json(products.reverse());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getProductsByCategory2 = getProductsByCategory2;
const getProductsByCategorySlug = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
      const category = yield category_model_1.default
        .findOne({ slug: slug })
        .select(
          "_id title slug img metaTitle metaDescription description shortDescription tags"
        )
        .populate({
          path: "subcategories",
          select: "title",
        })
        .lean();
      const categoryId =
        category === null || category === void 0 ? void 0 : category._id;
      const products = yield product_model_1.default
        .find({
          category: categoryId,
        })
        .select(
          "_id img title featured sele sellingPrice slug stockStatus writer publisher  subcategory language"
        );
      const writers = yield writer_model_1.default
        .find()
        .select("_id title slug img")
        .lean();
      const reverseProducts = products.reverse();
      res.status(200).json({ products: reverseProducts, writers, category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getProductsByCategorySlug = getProductsByCategorySlug;
const getProductsByPublishersSlug = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
      const publisher = yield publishers_model_1.default
        .findOne({ slug: slug })
        .select(
          "_id title slug imgUrl keywords metaTitle metaDescription description shortDescription tags "
        )
        .lean();
      const publisherId =
        publisher === null || publisher === void 0 ? void 0 : publisher._id;
      const products = yield product_model_1.default
        .find({
          publisher: publisherId,
        })
        .select(
          "_id img title category subcategory writer  featured sele sellingPrice slug stockStatus language "
        );
      const writers = yield writer_model_1.default
        .find()
        .select("title")
        .lean();
      const categories = yield category_model_1.default
        .find()
        .select("title")
        .populate({
          path: "subcategories",
          select: "title",
        })
        .lean();
      const reverseProducts = products.reverse();
      res
        .status(200)
        .json({ products: reverseProducts, writers, publisher, categories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getProductsByPublishersSlug = getProductsByPublishersSlug;
//new
