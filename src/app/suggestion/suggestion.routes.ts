import express from "express";
import {
  getAllSuggestions,
  getSuggestionById,
  create,
  deleteSuggestion,
  update,
  allForAdminIndexPage,
  singleForEditPage,
} from "./suggestion.controller";
import { verAdminTkn } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Suggestion from "./suggestion.model";

const router = express.Router();
router.get("/", getAllSuggestions);
router.get("/allForAdminIndexPage", allForAdminIndexPage);
router.get("/singleForEditPage/:id", verAdminTkn, singleForEditPage);

router.get("/getSingleSuggestion/:id", getSuggestionById);
router.post("/create", create);
router.delete("/:id", deleteSuggestion);
router.put("/update/:id", update);
router.delete("/delete/:id", verAdminTkn, deleteById(Suggestion));

export default router;
