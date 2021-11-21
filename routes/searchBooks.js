const router = require("express").Router();
const axios = require('axios');

/* GET home page */
router.get("/search", async (req, res, next) => {
    console.log(req.query)
    try {
        const axiosCall = await axios(
          `https://www.googleapis.com/books/v1/volumes?q=${req.query.title}&maxResults=12`
        );
        const booksInfo = axiosCall.data.items; //esto es un array
        // console.log(booksInfo)
        res.render("books/search.hbs", {booksInfo});
      } catch (err) {
        console.log(err);
    }
});

module.exports = router;