const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
});

const User = model("User", userSchema);

module.exports = User;
