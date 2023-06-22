const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {User} = require("../models/user");
const {ctrlWrapper, HttpError, } = require("../helpers/index");
const {Recipe} = require("../models/recipe");

require("dotenv").config();
const secret = process.env.SECRET_KEY;


const fetchSavedRecipe = async (req,res) => {
    try {
        const { userId } = req.params;

        // Получить информацию о пользователе по userId
        const user = await User.findById(userId).populate('savedRecipes');

        // Извлечь список сохраненных рецептов
        const savedRecipes = user.savedRecipes;

        // Возвращаем полные данные сохраненных рецептов
        res.json(savedRecipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера!' });
    }
}
const addSavedRecipe = async (req, res) => {
    try {
        const { userId, recipeId } = req.params;

        // Найти пользователя по идентификатору
        const user = await User.findById(userId);

        // Проверить, есть ли рецепт с указанным идентификатором в списке сохраненных рецептов пользователя
        const recipeExists = user.savedRecipes.includes(recipeId);
        const recipe = await Recipe.findById(recipeId)
        console.log(recipe)
        if (recipeExists) {
            return res.status(400).json({ message: 'Рецепт уже добавлен в сохраненные' });
        }

        // Добавить рецепт в список сохраненных рецептов пользователя
        user.savedRecipes.push(recipeId);

        await user.save();
        res.json({ recipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Контроллер для удаления рецепта из списка сохраненных
const removeSavedRecipe = async (req, res) => {
    try {
        const { userId, recipeId } = req.params;

        // Найти пользователя по идентификатору
        const user = await User.findById(userId);
        const recipe = await Recipe.findById(recipeId)


        // Проверить, есть ли рецепт с указанным идентификатором в списке сохраненных рецептов пользователя
        const index = user.savedRecipes.findIndex(savedRecipeId => savedRecipeId.equals(recipeId));
        console.log("index "+index)
        if (index === -1) {
            return res.status(404).json({ message: 'Сохраненный рецепт не найден' });
        }

        // Удалить рецепт из списка сохраненных рецептов пользователя
        user.savedRecipes.splice(index, 1);
        await user.save();

        res.json({ recipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (user) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,

    });

    const id = newUser._id;
    const token = jwt.sign({id}, secret, {expiresIn: "23h"});
    await User.findByIdAndUpdate(id, {token});

    res.status(201).json({
        token,
        email: newUser.email,
        id,

    });
};

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const compareResult = await bcrypt.compare(password, user.password);

    if (!compareResult) {
        throw HttpError(401, "Email or password is wrong");
    }

    const id = user._id;
    const token = jwt.sign({id}, secret, {expiresIn: "23h"});
    await User.findByIdAndUpdate(id, {token});
    res.status(201).json({
        token,
        email: user.email,
        id,
        savedRecipes: user.savedRecipes,
    });
};

const logout = async (req, res) => {
    const {_id} = req.user;

    await User.findByIdAndUpdate(_id, {token: ""});
    res.status(204).end();
};
const getCurrent = async (req, res) => {
    const {email} = req.user;
    const user = await User.findOne({email});

    res.json({
            email,
        id: user._id,
        savedRecipes: user.savedRecipes
    });
};


module.exports = {
    fetchSavedRecipe: ctrlWrapper(fetchSavedRecipe),
    addSavedRecipe: ctrlWrapper(addSavedRecipe),
    removeSavedRecipe: ctrlWrapper(removeSavedRecipe),
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
};

