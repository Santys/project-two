const router = require("express").Router();
const axios = require('axios');
const {isLoggedIn} = require("../middleware/route-guard")


// Model
const User = require("../models/User.model")
const Book = require("../models/Book.model")
const Review = require("../models/Review.model")


/* POST create */
router.post("/review/:id", isLoggedIn, async (req, res, next) => {
    const { review, rating } = req.body;
    const idUser = req.session.loggedUser._id
    const username = req.session.loggedUser.username
    const idBook = req.params.id
    try {
        //Check if book exist, if not, create it
        let bookTargeted = await Book.findOne({ idApi: idBook })
        if(!bookTargeted){
            const axiosCall = await axios(
                `https://www.googleapis.com/books/v1/volumes/${idBook}`
            );
            const bookInfo = axiosCall.data;
            
            bookTargeted = await Book.create({
                title: bookInfo.volumeInfo.title, 
                author: bookInfo.volumeInfo.authors,
                cover: bookInfo.volumeInfo.imageLinks.thumbnail,
                idApi: bookInfo.id
            })
        }
        // Create review
        const newReview = await Review.create({owner: username, comment: review, rating, idBook: bookTargeted._id})
        const updatedUser = await User.findByIdAndUpdate( idUser , {$push: {reviews: newReview._id}}, { new: true })
        const updatedBook = await Book.findByIdAndUpdate( bookTargeted._id , {$push: {reviews: newReview._id}}, { new: true })
        // Calculate rating => newRating = oldRating + (nrating - oldRating)/reviews
        const newRating = updatedBook.rating + ((rating - updatedBook.rating)/ updatedBook.reviews.length)
        const updatedRateBook = await Book.findByIdAndUpdate( updatedBook._id , {rating: newRating}, { new: true })
        res.redirect(`/books/${idBook}`)
    } catch (err) {
        console.log(err);
    }
});

/* POST edit */
router.post("/review/edit/:id", isLoggedIn, async (req, res, next) => {
    console.log(req.body)
    console.log(req.params.id)
    const idReview = req.params.id
    const { review, rating } = req.body;
    // const idUser = req.session.loggedUser._id
    // const username = req.session.loggedUser.username
    // const idReview = req.params.id
    // console.log(username)
    try {
        const updatedReview = await Review.findByIdAndUpdate( idReview , {comment: review, rating}, { new: true })
        let bookTargeted = await Book.findById( updatedReview.idBook )
        const newRating = bookTargeted.rating + ((rating - bookTargeted.rating)/ bookTargeted.reviews.length)
        const updatedRateBook = await Book.findByIdAndUpdate( updatedReview.idBook , {rating: newRating}, { new: true })
        res.redirect('/profile')
    } catch(err){
        console.log(err)
    }

});

/* POST delete */
router.post("/review/delete/:id", isLoggedIn, async (req, res, next) => {
    console.log(req.body)
    console.log(req.params.id)
    const idReview = req.params.id
    try {
        const username = req.session.loggedUser.username
        const review = await Review.findById(idReview)
        if(username != review.owner){
            res.redirect("/profile")
            return
        }
        const deletedReview = await Review.findByIdAndRemove(idReview);
        res.redirect("/profile")
    } catch(err) {
        res.render("not-found.hbs", { errorMsg: "Review not deleted" });
    }

});

module.exports = router;