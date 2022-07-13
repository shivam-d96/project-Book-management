const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/booksModel")
const validator = require("../Validator/validation")
const moment = require("moment");

//----------- create Book By Id API's--------//

const createReview = async function (req, res) {
    try {
        let data = { reviewedBy, rating, review } = req.body

        if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) {
            return res.status(400).send({ status: false, message: "please enter valid bookId" })
        }

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "please give some input" })

        if (reviewedBy || reviewedBy == "") {
            if (!validator.isValid(reviewedBy))
                return res.status(400).send({ status: false, message: "name of reviewer is required here." })
        } else reviewedBy = "guest";

        if (!reviewedAt) return res.status(400).send({ status: false, message: "Please enter reviewedAt." })

        if (!rating) return res.status(400).send({ status: false, message: "Please enter rating." })
        data.reviewedAt = new Date();
        if (!moment(data.reviewedAt, "YYYY-MM-DD", true).isValid())
            return res.status(400).send({
                status: false,
                message: "Enter a valid date with the format (YYYY-MM-DD).",
            });

        // -----  validation rating range 1 to 5 -----//
        if (!/[1-5]/.test(rating))
            return res.status(400).send({ status: false, message: "please enter rating between 1 to 5" })


        const updatedBook = await bookModel.findByIdAndUpdate(req.params.bookId, { $inc: { reviews: 1 } }, { new: true }).lean().select({ isDeleted: 0, __v: 0 });

        if (!updatedBook) return res.status(400).send({ status: false, message: "No book found with this BookId" })

        
        data.bookId = req.params.bookId;
        let createdReview = await reviewModel.create(data);
        updatedBook["reviewsData"] = createdReview;

        return res.status(201).send({ status: true, message: 'Success', data: updatedBook })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });

    }
}

//------ update Book & Review By Id API's-------//

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "please enter valid bookId" });
        if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "please enter valid revieId" });

        let checkBookId = await bookModel.findById({ _id: bookId, isDeleted: false });
        if (!checkBookId)
            return res.status(404).send({ status: false, message: "book not found " })

        let checkReviewId = await reviewModel.findById({ _id: reviewId, isDeleted: false })
        if (!checkReviewId)
            return res.status(404).send({ status: false, message: "review not found " })

        let { reviewedBy, rating, review } = req.body

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "please enter valid reviewDetails" })
        }
        if (reviewedBy || reviewedBy == "") {
            if (!validator.isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "please enter valid reviewer's name" })
            }
        }

        if (rating || rating == "") {
            if (!/[1-5]/.test(rating)) {
                return res.status(400).send({ status: false, message: "please enter rating between 1 to 5" })
            }
        }

        if (review || review == "") {
            if (!validator.isValid(review)) {
                return res.status(400).send({ status: false, message: "please enter valid review" })
            }
        }

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { reviewedBy, rating, review } }, { upsert: true, new: true }).select({ isDeleted: 0, __v: 0 });
        const books = await bookModel.findById(bookId).lean().select({ isDeleted: 0, __v: 0 });
        books.reviewsData = updatedReview;
        return res.status(200).send({ status: true, message: "Books list", data: books });
    } catch (err) {
        return res.send({ status: false, message: err.message })
    }
}

// -------------Delete Book & Review By Id API's--------//

const deleteByreviewId = async (req, res) => {
    try {

        let reviewId = req.params.reviewId;
        let bookId = req.params.bookId;

        //-------------ReviewId valid or not --------------//

        if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Invalid reviewId." })

        //-------------BookId valid or not --------------//

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId." })

        let isExistsReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false });

        if (!isExistsReview) return res.status(404).send({ status: false, message: "Review does not exists." });

        let isExistsBook = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!isExistsBook) return res.status(404).send({ status: false, message: "Book does not exists." });

        //---------------review delete ------------------//

        await reviewModel.updateOne({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true }, review: "" })

        //---------------book review delete ------------------//

        await bookModel.updateOne({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true }, $inc: { reviews: -1 }, deletedAt: new Date() });

        return res.status(200).send({ status: true, message: "Review and Book review Document Deleted successfully." })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports.createReview = createReview;
module.exports.deleteByreviewId = deleteByreviewId
module.exports.updateReview = updateReview;


