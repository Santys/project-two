const router = require("express").Router();
const bcrypt = require('bcryptjs');
const {isLoggedIn} = require("../middleware/route-guard")

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

/* GET profile */
router.get("/profile", isLoggedIn, async (req, res, next) => {
  const idUser = req.session.loggedUser._id
  try{
    const currentUser = await User.findById(idUser).populate({
      path: 'reviews',
      populate:{
        path: 'idBook'
      } 
    })
    res.render("users/profile.hbs", currentUser);
  } catch(err) {
    console.log(err)
  }
});

/* POST sign up */
router.post("/signup", async (req, res, next) => {
  const {username, password} = req.body;
  //Check if any inputs are not filled
  if(!username || !password) {
    res.render("users/signup.hbs", {msg: "You need to fill all inputs"})
    return;
  }
  try {
    //Check if username already exist en DB
    const userAlreadyExists = await User.findOne({ username });
    if (userAlreadyExists) {
      res.render("users/signup.hbs", { msg: "This user already has an account" });
      return;
    }
    // Create user
    //Encrypt password
    var hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({username, password: hashedPassword})
    res.redirect("/login")
  } catch (err){
    console.log(err)
  }
});

/* POST log in */
router.post("/login", async (req, res, next) => {
  const {username, password} = req.body;
  //Check if username already exist en DB
  if(!username || !password) {
    res.render("users/signup.hbs", {msg: "You need to fill all inputs"})
    return;
  }
  try {
    const userFromDB = await User.findOne({username})
    if(!userFromDB){ 
      res.render("users/login.hbs", {msg: "The user does not exist"})
    } else { 
      const passwordsMatch = await bcrypt.compare(password, userFromDB.password)
      if(!passwordsMatch){
        res.render("users/login.hbs", {msg: "Incorrect password"})
      } else {
        req.session.loggedUser = userFromDB
        console.log('Session =======>  ', req.session)
        res.render("users/login.hbs", {msg: "Log in correct!"})
        // res.redirect(`/users/profile`)
      }
    }
  } catch (err){
    console.log(err)
  }
});

/* POST log out */
router.post("/logout", async (req, res, next) => {
  res.clearCookie('connect.sid', {path: '/'})
  try{
    await req.session.destroy()
    res.redirect('/')
  }catch(err){
    next(err);
  }
});

module.exports = router;
