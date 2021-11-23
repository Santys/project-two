const router = require("express").Router();
const axios = require('axios');
const {isLoggedIn} = require("../middleware/route-guard")

// Import model
const Book = require("../models/Book.model")

/* GET home page */
router.get("/search", isLoggedIn,  async (req, res, next) => {
    console.log(req.query)
    try {
        const axiosCall = await axios(
          `https://www.googleapis.com/books/v1/volumes?q=${req.query.title}&maxResults=12`
        );
        const booksInfo = axiosCall.data.items; 
        // console.log(booksInfo)
        res.render("books/search.hbs", {booksInfo});
      } catch (err) {
        console.log(err);
    }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const axiosCall = await axios(
      `https://www.googleapis.com/books/v1/volumes/${req.params.id}`
    );
    const bookInfo = axiosCall.data; 
    // Check if book has reviews
    const bookInDB = await Book.findOne({ idApi: bookInfo.id }).populate('reviews')
    // if(bookInDB) bookInDB.populate('reviews')
    // console.log(bookInDB)
    res.render("books/book.hbs", {bookInfo, bookInDB});
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;