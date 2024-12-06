"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comparison_controller_1 = require("./comparison.controller");
const router = express_1.default.Router();
router.post("/create", comparison_controller_1.saveComparisonController);
// Route to get all comparisons
router.get("/all", comparison_controller_1.getAllComparisonsController);
// Route to delete all comparisons
router.delete("/all", comparison_controller_1.deleteAllComparisons);
// Route to delete a single comparison by its ID
router.delete("/:id", comparison_controller_1.deleteComparisonById);
exports.default = router;
