const router = require("express").Router();
const axios = require('axios');

/* GET home page */
router.post("/review", async (req, res, next) => {
    console.log(req.body)
    try {

    } catch (err) {
        console.log(err);
    }
});


module.exports = router;