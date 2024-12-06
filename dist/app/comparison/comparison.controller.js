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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComparisonById = exports.deleteAllComparisons = exports.getAllComparisonsController = exports.saveComparisonController = void 0;
const comparison_model_1 = require("./comparison.model");
// Save Comparison Controller (already exists)
const saveComparisonController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { leftProductId, rightProductId } = req.body;
        if (!leftProductId || !rightProductId) {
            res.status(400).json({ message: "Product IDs are required" });
            return;
        }
        // Ensure that leftProductId is always less than rightProductId to prevent duplicate entries
        const [firstProductId, secondProductId] = leftProductId < rightProductId
            ? [leftProductId, rightProductId]
            : [rightProductId, leftProductId];
        // Check if the comparison already exists
        const existingComparison = yield comparison_model_1.Comparison.findOne({
            leftProductId: firstProductId,
            rightProductId: secondProductId,
        });
        if (existingComparison) {
            res.status(409).json({ message: "Comparison already exists" });
            return;
        }
        // Create a new comparison
        const comparison = new comparison_model_1.Comparison({
            leftProductId: firstProductId,
            rightProductId: secondProductId,
        });
        yield comparison.save();
        res
            .status(201)
            .json({ message: "Comparison saved successfully", comparison });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to save comparison", error });
    }
});
exports.saveComparisonController = saveComparisonController;
// Get All Comparisons Controller (already exists)
const getAllComparisonsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comparisons_p = yield comparison_model_1.Comparison.find().populate("leftProductId rightProductId");
        const comparisons = comparisons_p.reverse();
        res.status(200).json({ comparisons });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve comparisons", error });
    }
});
exports.getAllComparisonsController = getAllComparisonsController;
// Delete All Comparisons Controller
const deleteAllComparisons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield comparison_model_1.Comparison.deleteMany(); // Delete all comparisons
        res.status(200).json({ message: "All comparisons deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete comparisons", error });
    }
});
exports.deleteAllComparisons = deleteAllComparisons;
// Delete Single Comparison by ID Controller
const deleteComparisonById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedComparison = yield comparison_model_1.Comparison.findByIdAndDelete(id);
        if (!deletedComparison) {
            res.status(404).json({ message: "Comparison not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Comparison deleted successfully", deletedComparison });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete comparison", error });
    }
});
exports.deleteComparisonById = deleteComparisonById;
