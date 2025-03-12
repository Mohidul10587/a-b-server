"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suggestion_controller_1 = require("./suggestion.controller");
const router = express_1.default.Router();
router.get("/", suggestion_controller_1.getAllSuggestions);
router.get("/getSingleSuggestion/:id", suggestion_controller_1.getSuggestionById);
router.post("/", suggestion_controller_1.create);
router.delete("/:id", suggestion_controller_1.deleteSuggestion);
router.post("/updateSuggestion/:id", suggestion_controller_1.updateSuggestion);
exports.default = router;
