const router = require("express").Router();

// Import model
const Book = require("../models/Book.model")

/* GET home page */
router.get("/", async (req, res, next) => {
  try{
    const bestBooks = await Book.find()
    .sort({rating: -1})
    .limit(10)

    res.render("index", { bestBooks });
  } catch(err){

  }
});

module.exports = router;
