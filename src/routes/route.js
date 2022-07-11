const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")
const reviewController = require("../controller/reviewController")
<<<<<<< HEAD
const { authenticate, authorisation, verifyUser } = require("../middleware/auth");
=======
const { authenticate, authorisation } = require("../middleware/auth");
>>>>>>> e32b767be525ae776ca2cda7e2fa406463741af9

router.post("/register", userController.createUser)
router.post("/login", userController.userLogin)
router.post("/books", authenticate, verifyUser, bookController.createBooks)
router.get("/books", authenticate, bookController.getBooks)
router.put("/books/:bookId", authenticate, authorisation, bookController.updateBooks)
router.delete("/books/:bookId", authenticate, authorisation, bookController.deleteByBooKId);
<<<<<<< HEAD
router.post("/books/:bookId/review", reviewController.reviewsData);
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteByreviewId );
=======
router.post("/books/:bookId/review", authenticate, reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",authenticate, reviewController.updateReview)
>>>>>>> e32b767be525ae776ca2cda7e2fa406463741af9
module.exports = router;
