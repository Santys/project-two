const router = require("express").Router();

// Model
const User = require("../models/User.model")

/* GET sign up */
router.get("/signup", (req, res, next) => {
  res.render("users/signup.hbs");
});

/* GET log in */
router.get("/login", (req, res, next) => {
  res.render("users/login.hbs");
});


module.exports = router;
