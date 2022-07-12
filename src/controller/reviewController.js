const { default: mongoose, now } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/booksModel")
const validator = require("../Validator/validation")
const moment = require("moment");

//----------- create Book By Id API's--------//

const createReview = async function (req, res) {
    try {
        let data = { reviewedBy, rating, review, bookId,reviewedAt } = req.body

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "fill all fields." })

        if (!mongoose.Types.ObjectId.isValid(req.params.bookId))

            return res.status(400).send({ status: false, message: "please enter valid bookId" })

        if (!bookId) return res.status(400).send({ status: false, message: "Please enter bookId" })

        if (reviewedBy || reviewedBy == "") {
            if (!validator.isValid(reviewedBy))
                return res.status(400).send({ status: false, message: "name of reviewer is required here." })
        } else reviewedBy = "guest";
        
        if(!reviewedAt) return res.status(400).send({status: false, message : "Please enter reviewedAt."})

        if(!rating) return res.status(400).send({status: false, message: "Please enter rating."})

        if (!moment(reviewedAt, "YYYY-MM-DD", true).isValid())
        return res.status(400).send({
            status: false,
            message: "Enter a valid date with the format (YYYY-MM-DD).",
        });

        // -----  validation rating range 1 to 5 -----//
        if (!/[1-5]/.test(rating))
            return res.status(400).send({ status: false, message: "please enter rating between 1 to 5" })


        const updatedBook = await bookModel.findByIdAndUpdate(req.params.bookId, { $inc: { reviews: 1 } }, { new: true }).lean();

        if (!updatedBook) return res.status(400).send({ status: false, message: "No book found with this BookId" })

        data.reviewedAt = new Date();
        data.bookId = req.params.bookId;
        let createdReview = await reviewModel.create(data);
        updatedBook.reviewData = createdReview;

        const bookData = await reviewModel.findById(createdReview["_id"], { isDeleted: 0, __v: 0 });
        updatedBook["reviewsData"] = createdReview;

        return res.status(201).send({ status: true, message: 'Success', data: bookData })

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

        let checkBookId = await bookModel.findById({ _id: bookId, isDeleted: false });
        if (!checkBookId && (!mongoose.Types.ObjectId.isValid(checkBookId)))
            res.status(404).send({ status: false, message: "book not found enter valid bookId" })

        let checkReviewId = await reviewModel.findById({ _id: reviewId })
        if (!checkReviewId && (!mongoose.Types.ObjectId.isValid(reviewId)))
            res.status(404).send({ status: false, message: "review not found enter valid reviewId" })

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

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { reviewedBy, rating, review } }, { upsert: true, new: true });
        const books = await bookModel.findById(bookId).lean();
        books.reviewsData = updatedReview;
        res.status(200).send({ status: true, message: "Books list", data: books });
    } catch (err) {
        res.send({ status: false, message: err.message })
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

        if (!isExistsReview) return res.status(400).send({ status: false, message: "Reviwe does not exists." });

        let isExistsBook = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!isExistsBook) return res.status(400).send({ status: false, message: "Book does not exists." });

        //---------------- Review Document already delete or not ---------//

        if (isExistsReview.isDeleted == true) return res.status(200).send({ status: true, message: "Review Document already deleted." });

        //---------------- Book Document already delete or not ---------//

        if (isExistsBook.isDeleted == true) return res.status(200).send({ status: true, message: "Book Document already deleted." })

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


