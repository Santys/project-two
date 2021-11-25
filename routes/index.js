const router = require("express").Router();

// Import model
const Book = require("../models/Book.model")

/* GET home page */
router.get("/", async (req, res, next) => {
  try{
    const user = req.session.loggedUser
    const bestBooks = await Book.find()
    .sort({rating: -1})
    .limit(12)

    res.render("index", { bestBooks, user });
  } catch(err){

  }
});

module.exports = router;
