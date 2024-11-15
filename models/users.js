const mongoose = require("mongoose");

const firstNameSchema = mongoose.Schema(
  {
    boy: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length === 3;
        },
        message: (props) =>
          `Le tableau doit contenir entre 3 éléments, mais il en contient ${props.value.length}.`,
      },
    },
    girl: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length === 3;
        },
        message: (props) =>
          `Le tableau doit contenir entre 3 éléments, mais il en contient ${props.value.length}.`,
      },
    },
  },
  { _id: false }
);

const predictionsSchema = mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["boy", "girl", ""],
      default: "",
    },
    firstName: {
      type: firstNameSchema,
    },
    birthDay: {
      type: Date,
    },
  },
  { _id: false }
);

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Missing Name"],
  },
  email: {
    type: String,
    required: [true, "Missing E-mail"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "invalid email address"],
    unique: [true, "User already existing"],
  },
  password: {
    type: String,
    required: [true, "Missing Password"],
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  predictions: {
    type: predictionsSchema,
  },
});

firstNameSchema.pre("save", function (next) {
  if (!this.boy.length) this.boy = ["", "", ""];
  if (!this.girl.length) this.girl = ["", "", ""];
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
