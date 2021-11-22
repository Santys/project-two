const router = require("express").Router();
const axios = require('axios');

/* GET home page */
router.get("/search", async (req, res, next) => {
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

router.get("/:id", async (req, res, next) => {
  try {
    const axiosCall = await axios(
      `https://www.googleapis.com/books/v1/volumes/${req.params.id}`
    );
    const bookInfo = axiosCall.data; 
    // console.log(bookInfo)
    res.render("books/book.hbs", bookInfo);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;