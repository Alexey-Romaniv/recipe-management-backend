const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

// const emailRegexp =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
      savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'recipe' }],

    token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});





const User = model("user", userSchema);

module.exports = {
  User,
  schema,
};
