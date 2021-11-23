const router = require("express").Router();
const axios = require('axios');

// Model
const User = require("../models/User.model")
const Book = require("../models/Book.model")
const Review = require("../models/Review.model")


/* POST create */
router.post("/review/:id", async (req, res, next) => {
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
router.post("/review/:id/edit", async (req, res, next) => {
    console.log(req.body)
    console.log(req.params.id)
    // const { review, rating } = req.body;
    // const idUser = req.session.loggedUser._id
    // const username = req.session.loggedUser.username
    // const idReview = req.params.id
    // console.log(username)


});

        // const updatedReview = await Review.findByIdAndUpdate( newReview._id , {$push: {idBook: bookTargeted._id}}, { new: true })


module.exports = router;