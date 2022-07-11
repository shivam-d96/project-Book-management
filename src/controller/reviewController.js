const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/booksModel")
const validator = require("../Validator/validation")

const reviewsData = async function (req, res) {
    try {

        let { bookId, reviewedBy, reviewedAt, rating, review } = req.body

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, message: "pl enter the required information" })


        if (!validator.isValid(reviewedBy))
            return res.status(400).send({ status: false, message: "name is required here." })


        if (!validator.isValid(review))
            return res.status(400).send({ status: false, message: "review  is required." })
        if (!validator.isValid(rating))
            return res.status(400).send({ status: false, message: "rating is required here." })


        if (!validator.isValid(reviewedAt))
            return res.status(400).send({ status: false, message: "date is required." })
        if (!validator.isValid(bookId))
            return res.status(400).send({ status: false, message: "bookId is required." })


        if (!mongoose.isValidObjectId(req.body.bookId))
            return res.status(400).send({ status: false, msg: "please enter valid bookId" })

        const bookid = await bookModel.findById(req.body.bookId);
        if (!bookid) return res.status(400).send({ status: false, msg: "no such bookId present" })

        const reviewData = await reviewModel.create(req.body);

        return res.status(201).send({ status: true, message: 'Success', data: reviewData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }
}


const deleteByreviewId = async (req, res) => {
    try {

        let reviewId = req.params.reviewId;
        let bookId = req.params.bookId;

        //-------------ReviewId valid or not --------------//

        if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Invalid reviewId." })

         //-------------BookId valid or not --------------//

         if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId." })

        let isExistsReview = await reviewModel.findById({ _id: reviewId });

        if (!isExistsReview) return res.status(400).send({ status: false, message: "Reviwe does not exists." });

        let isExistsBook = await bookModel.findById({ _id: bookId });

        if (!isExistsBook) return res.status(400).send({ status: false, message: "Book does not exists." });

        //---------------- Review Document already delete or not ---------//

        if (isExistsReview.isDeleted == true) return res.status(200).send({ status: true, message: "Review Document already deleted." });

        //---------------- Book Document already delete or not ---------//

        if (isExistsBook.isDeleted == true) return res.status(200).send({ status: true, message: " Book Document already deleted." })

        //---------------review delete ------------------//

        await reviewModel.updateOne({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true }, review: "" })

        //---------------book review delete ------------------//

        await bookModel.updateOne({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true }, $inc: { reviews: -1 }, deletedAt: new Date() });

        return res.status(200).send({ status: true, message: "Review and Book review Document Deleted successfully." })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


module.exports.reviewsData = reviewsData;
module.exports.deleteByreviewId = deleteByreviewId