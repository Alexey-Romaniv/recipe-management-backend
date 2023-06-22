const express = require("express");

const ctrl = require("../../controllers/recipe");

const {  authenticate, validateBody } = require("../../middlewares");
const {  schemas} = require("../../models/recipe");
const router = express.Router();

router.get("/", authenticate, ctrl.getRecipes);

router.get("/:contactId", authenticate, ctrl.getRecipeById);

router.post("/create/:userId", authenticate, validateBody(schemas), ctrl.createRecipe);



router.delete("/:recipeId", authenticate, ctrl.deleteRecipe);

module.exports = router;
