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
exports.updateSuggestion = exports.deleteSuggestion = exports.create = exports.getSuggestionById = exports.getAllSuggestions = void 0;
const suggestion_model_1 = __importDefault(require("./suggestion.model"));
// Get all suggestions
const getAllSuggestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suggestions = yield suggestion_model_1.default.find().populate({
            path: "products",
            select: "_id title price photo",
        });
        if (suggestions.length === 0) {
            res.status(200).json({ suggestions, message: "Suggestions not found" });
            return;
        }
        res
            .status(200)
            .json({ suggestions, message: "Suggestions Fetched successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllSuggestions = getAllSuggestions;
// Get a single suggestion by ID
const getSuggestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const suggestion = yield suggestion_model_1.default.findById(id).populate({
            path: "products",
            select: "_id title price photo shippingInside shippingOutside",
        });
        if (!suggestion) {
            res.status(404).json({ message: "Suggestion not found" });
            return;
        }
        res.status(200).json(suggestion);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSuggestionById = getSuggestionById;
// Create a new suggestion
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const suggestion = yield suggestion_model_1.default.create(data);
        res.status(201).json(suggestion);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.create = create;
// Delete a suggestion by ID
const deleteSuggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedSuggestion = yield suggestion_model_1.default.findByIdAndDelete(id);
        if (!deletedSuggestion) {
            res.status(404).json({ message: "Suggestion not found" });
            return;
        }
        res.status(200).json({ message: "Suggestion deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteSuggestion = deleteSuggestion;
const updateSuggestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const suggestionId = req.params.id;
    const data = req.body; // Destructuring the updated data from the request body
    try {
        // Find the suggestion by its ID and update it
        const updatedSuggestion = yield suggestion_model_1.default.findByIdAndUpdate(suggestionId, { title: data.title, products: data.products }, // Fields to update
        { new: true } // Return the updated document
        );
        if (!updatedSuggestion) {
            return res
                .status(404)
                .json({ success: false, message: "Suggestion not found" });
        }
        // Return the updated suggestion as a response
        return res.status(200).json({
            success: true,
            updatedSuggestion,
            message: "Successfully updated",
        });
    }
    catch (error) {
        console.error("Error updating suggestion:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while updating the suggestion." });
    }
});
exports.updateSuggestion = updateSuggestion;
