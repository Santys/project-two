const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{type: Schema.Types.ObjectId, ref: 'Reviews'}]
});

const Book = model("Book", bookSchema);

module.exports = Book;
