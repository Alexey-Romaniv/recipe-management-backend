const express = require("express");

const ctrl = require("../../controllers/users");
const { validateBody, authenticate } = require("../../middlewares");

const { schema } = require("../../models/user");
const router = express.Router();

router.post("/register", validateBody(schema), ctrl.register);
router.post("/login", validateBody(schema), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.getCurrent);

// Маршрут для добавления рецепта в сохраненные
router.get("/:userId/savedRecipes", authenticate, ctrl.fetchSavedRecipe)
router.post('/:userId/savedRecipes/:recipeId',authenticate, ctrl.addSavedRecipe);

// Маршрут для удаления рецепта из сохраненных
router.delete('/:userId/savedRecipes/:recipeId',authenticate,  ctrl.removeSavedRecipe);

module.exports = router;
