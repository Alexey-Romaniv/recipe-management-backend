const {Recipe} = require('../models/recipe');
const {User} = require('../models/user');
const { ctrlWrapper, HttpError } = require("../helpers/index");


// Получить список всех рецептов
 const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        console.log("GatALL")
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера!' });
    }
};

// Получить информацию о конкретном рецепте
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            throw HttpError(404);
        }
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Создать новый рецепт
const createRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.create(req.body);
        const {userId} = req.params;
        const user = await User.findById(userId);
            user.savedRecipes.shift(recipe._id);

        await user.save();

        res.status(201).json(recipe);
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        throw HttpError(500);

    }
};


// Удалить рецепт
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndRemove(req.params.id);
        if (!recipe) {
            // return res.status(404).json({ message: 'Рецепт не найден' });
            throw HttpError(404);

        }
        res.json({ message: 'Рецепт успешно удален' });
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        throw HttpError(500);

    }
};

module.exports = {
    getRecipes: ctrlWrapper(getRecipes),
    getRecipeById: ctrlWrapper(getRecipeById),
    createRecipe: ctrlWrapper(createRecipe),
    deleteRecipe: ctrlWrapper(deleteRecipe),
};
