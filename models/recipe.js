const {Schema, model} = require("mongoose");
const Joi = require("joi");

const {handleMongooseError} = require("../helpers");


const recipeSchema = new Schema({
        title: {type: String, required: true},
        description: {type: String, required: true},
        ingredients: [{quantity: String, name: String, type: Object, required: true}],
        instructions: [{type: String, required: true}],
        imageURL: {type: String},

    },
    {versionKey: false, timestamps: true}
);

const addSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array().items(
        Joi.object({
            quantity: Joi.string().required(),
            name: Joi.string().required()
        })
    ),
    instructions: Joi.array().items(Joi.string().required()),
    imageURL: Joi.string().required()
});


recipeSchema.post("save", handleMongooseError);




const Recipe = model("recipe", recipeSchema);






module.exports = {Recipe, schemas: addSchema};
