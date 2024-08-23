const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Missing Field"],
  },
  email: {
    type: String,
    required: [true, "Missing Field"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "invalid email address"],
    unique: [true, "User already existing"],
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
