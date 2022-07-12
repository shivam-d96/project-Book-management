const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
const { authenticate, authorisation } = require("../middleware/auth");

//============================user api================================//
router.post("/register", userController.createUser)
router.post("/login", userController.userLogin)

//============================book api================================//
router.post("/books",authenticate, bookController.createBooks)
router.get("/books", authenticate, bookController.getBooks)
router.get("/books/:bookId",authenticate,  bookController.getBookById)
router.put("/books/:bookId", authenticate, authorisation, bookController.updateBooks)
router.delete("/books/:bookId", authenticate, authorisation, bookController.deleteBybookId);

//============================review api================================//
router.post("/books/:bookId/review",  reviewController.createReview)
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteByreviewId)
router.put("/books/:bookId/review/:reviewId",authenticate, reviewController.updateReview)

module.exports = router;
