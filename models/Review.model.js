const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  owner: {
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
  idBook: [{type: Schema.Types.ObjectId, ref: 'Book'}]
});

const Review = model("Review", reviewSchema);

module.exports = Review;
