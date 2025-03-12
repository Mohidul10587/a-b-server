import express from "express";
import {
  getAllSuggestions,
  getSuggestionById,
  create,
  deleteSuggestion,
  updateSuggestion,
} from "./suggestion.controller";

const router = express.Router();

router.get("/", getAllSuggestions);
router.get("/getSingleSuggestion/:id", getSuggestionById);
router.post("/", create);
router.delete("/:id", deleteSuggestion);
router.post("/updateSuggestion/:id", updateSuggestion);

export default router;
