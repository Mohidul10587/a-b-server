"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWriteById = exports.getWriterBySlug = exports.getAllBrands = exports.updateBrand = exports.createBrand = void 0;
const writer_model_1 = __importDefault(require("./writer.model"));
const uploadSingleFileToCloudinary_1 = require("../../shared/uploadSingleFileToCloudinary");
const extractPublicKeyAndDelete_1 = require("../../shared/extractPublicKeyAndDelete");
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = req.files;
    try {
        const photoFile = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0];
        const metaImageFile = (_b = files === null || files === void 0 ? void 0 : files.metaImage) === null || _b === void 0 ? void 0 : _b[0];
        const photoUrl = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(photoFile);
        const metaImage = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(metaImageFile);
        const tagsArray = req.body.tags.split(",").map((tag) => tag.trim());
        const writer = new writer_model_1.default({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            photo: photoUrl,
            metaTitle: req.body.metaTitle,
            metaDescription: req.body.metaDescription,
            tags: tagsArray,
            metaImage: metaImage,
        });
        yield writer.save();
        res.status(200).send({ writer });
    }
    catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.createBrand = createBrand;
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = req.files;
    console.log(req.body.previousPhoto);
    try {
        const writer = yield writer_model_1.default.findById(req.params.id);
        if (!writer) {
            res.status(404).send({ error: "writer not found" });
            return;
        }
        const photoFile = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0];
        const metaImageFile = (_b = files === null || files === void 0 ? void 0 : files.metaImage) === null || _b === void 0 ? void 0 : _b[0];
        const photoUrl = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(photoFile);
        const metaImage = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(metaImageFile);
        // Update writer fields with data from the request body
        writer.title = req.body.title || writer.title;
        writer.slug = req.body.slug || writer.slug;
        writer.description = req.body.description || writer.description;
        writer.rating = req.body.rating || writer.rating;
        writer.metaTitle = req.body.metaTitle || writer.metaTitle;
        writer.metaDescription = req.body.metaDescription || writer.metaDescription;
        // Convert tags to an array if they are comma-separated
        writer.tags = req.body.tags
            ? req.body.tags.split(",").map((tag) => tag.trim())
            : writer.tags;
        // Update images if provided
        if (photoUrl) {
            writer.photo = photoUrl;
            const publicKey = req.body.previousPhoto;
            console.log("fisr", publicKey);
            yield (0, extractPublicKeyAndDelete_1.extractPublicKeyAndDelete)(publicKey);
        }
        if (metaImage) {
            writer.metaImage = metaImage;
            const publicKey = req.body.previousMetaImage;
            yield (0, extractPublicKeyAndDelete_1.extractPublicKeyAndDelete)(publicKey);
        }
        yield writer.save();
        res.status(200).send({ writer });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.updateBrand = updateBrand;
const getAllBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all brands
        const writers = yield writer_model_1.default.find();
        // // Fetch products and count products per writer
        // const brands = await Promise.all(
        //   previousBrands.map(async (writer) => {
        //     const productCount = await Product.countDocuments({
        //       writer: writer._id,
        //     });
        //     return {
        //       ...writer.toJSON(),
        //       brandProducts: productCount,
        //     };
        //   })
        // );
        res.status(200).json({ writers });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllBrands = getAllBrands;
const getWriterBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const writer = yield writer_model_1.default.findOne({ slug: req.params.slug });
        if (!writer) {
            res.status(404).send({ error: "writer not found" });
            return;
        }
        res.status(200).send({ writer });
    }
    catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getWriterBySlug = getWriterBySlug;
const getWriteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const writer = yield writer_model_1.default.findById(req.params.id);
        if (!writer) {
            res.status(404).send({ error: "writer not found" });
            return;
        }
        res.status(200).send({ writer });
    }
    catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.getWriteById = getWriteById;
// export const getAllBrands2 = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const brands = await writer.find().select("_id title").lean();
//     res.status(200).send(brands);
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
// export const deleteBrand = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const writer = await writer.findByIdAndDelete(req.params.id);
//     if (!writer) {
//       res.status(404).send({ error: "writer not found" });
//       return;
//     }
//     res.status(200).send({ message: "writer deleted successfully" });
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
// // Function to get all writer IDs
// export const getAllBrandIds = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const brandIds = await writer.find().select("_id").lean();
//     // Extract the _id field from each writer and return an array of IDs
//     const ids = brandIds.map((writer) => writer._id);
//     res.status(200).json(ids);
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
