const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});

const User = model("User", userSchema);

module.exports = User;
