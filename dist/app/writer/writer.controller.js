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
exports.update = exports.getWriteById = exports.getWriterBySlug = exports.getAllBrands = exports.singleWriterForWriterEditPage = exports.create = void 0;
const writer_model_1 = __importDefault(require("./writer.model"));
const generateSLug_1 = require("../shared/generateSLug");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = yield writer_model_1.default.create(Object.assign(Object.assign({}, req.body), { slug: (0, generateSLug_1.generateSlug)(req.body.title) }));
        // Send success message along with the created category data
        res.status(201).json({
            message: "Created successfully!",
            respondedData: newCategory, // Optionally, include the created category in the response
        });
    }
    catch (error) {
        // Send error message if there was an issue
        res.status(500).json({
            message: "Failed to create.",
            error: error.message,
        });
    }
});
exports.create = create;
// Get single
const singleWriterForWriterEditPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield writer_model_1.default.findOne({ _id: req.params.id });
        res.status(200).json({
            message: "Fetched successfully!",
            respondedData: item,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.singleWriterForWriterEditPage = singleWriterForWriterEditPage;
const getAllBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all brands
        const writers = yield writer_model_1.default.find();
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
// Update
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedItem = yield writer_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body), { slug: (0, generateSLug_1.generateSlug)(req.body.title) }), {
            new: true, // Return the updated document
            runValidators: true, // Run validation on the updated data
        });
        if (!updatedItem) {
            return res.status(404).json({
                message: "Not found.",
            });
        }
        res.status(200).json({
            message: "Updated successfully!",
            respondedData: updatedItem,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update.",
            error: error.message,
        });
    }
});
exports.update = update;
