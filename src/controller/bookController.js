const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const bookModel = require("../models/booksModel");
const reviewModel = require("../models/reviewModel");
const validator = require("../Validator/validation")
const moment = require("moment")
const userModel = require("../models/userModel")

    // --------- create API's------//

const createBooks = async (req, res) => {
    try {
        // const token = req.headers["x-api-key"];
        // const tokenDecoded = jwt.verify(token, "projectGroup69-3",);
        // if (req.body.userId != tokenDecoded.userId) return res.status(403).send({ status: false, message: "you cannot  create book for any other user. so, enter your own user id with which you are logged in " })
           
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = req.body;

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "fill all fields" })

        if (!validator.isValid(title)) return res.status(400).send({ status: false, message: "title is required" })

        const checkTitle = await bookModel.findOne({ title: title });

        if (checkTitle) return res.status(400).send({ status: false, message: "title is already present" });

        if (!validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "excerpt is required" })

        if (!validator.isValid(userId)) return res.status(400).send({ status: false, message: "userId is required" })

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please enter valid userId" })

        if (!validator.isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN number required" })

        const checkISBN = await bookModel.findOne({ ISBN: ISBN });

        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN already present" })

        if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) return res.status(400).send({ status: false, message: "Invalid ISBN" })

        if (!validator.isValid(category)) return res.status(400).send({ status: false, message: "category is required" })

        if (!validator.isValidArray(subcategory)) return res.status(400).send({ status: false, message: "subcategory is required must be array of string" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is required" })

        if (!moment(releasedAt, "YYYY-MM-DD", true).isValid())
            return res.status(400).send({
                status: false,
                message: "Enter a valid date with the format (YYYY-MM-DD).",
            });

        const userid = await userModel.findById(req.body.userId);
        if (!userid) return res.status(400).send({ status: false, message: "no such userId present" })

        const bookData = await bookModel.create(req.body);

        return res.status(201).send({ status: true, message: 'Success', data: bookData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }
}
    //---------- Get API's -------//

const getBooks = async function (req, res) {
    try {
        const filterByQuery = { isDeleted: false }
        const  { userId, category, subcategory } = req.query;

        if (userId || userId == "") {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "please give valid userId" })
            } else filterByQuery["userId"] = userId;
        }
        if (category || category == "") {
            if (!validator.isValid(category)) {
                return res.status(400).send({ status: false, message: "please enter valid category" })
            }
            filterByQuery["category"] = category;
        }
        if (subcategory || subcategory == "") {
            if (!validator.isValid(subcategory)) {
                return res.status(400).send({ status: false, message: "please enter valid category" })
            }
            const subcategoryArr = subcategory.trim().split(",").map(subcategory => subcategory.trim())
            filterByQuery["subcategory"] = subcategoryArr;
        }

        const books = await bookModel.find({filterByQuery, isDeleted: false}).select({ title: 1, excerpt: 1, userID: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });

        if (books.length == 0) return res.status(404).send({ status: false, message: "books not found" });

        return res.status(200).send({ status: true, message: "Books list", data: books })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
        //------------- Get Book By Id API's --------//

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId))
            return res.status(400).send({ status: false, message: " bookId is invalid" })

        let bookDetails = await bookModel.findOne({ _id: bookId, isDeleted: false }, { __v: 0 }).lean();

        if (!bookDetails)
            return res.status(404).send({ status: false, message: "there is no book document pl.insert valid bookId" })

        const reviewsData = await reviewModel.find({ bookId: bookDetails["_id"] }, { isDeleted: 0, __v: 0 })

        bookDetails["reviewsData"] = reviewsData;

        return res.status(200).send({ status: true, message: "Books list", data: bookDetails })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
    //------------ updat Book Id API's -----------//

const updateBooks = async function (req, res) {

    try {
        bookId = req.params.bookId;
        // Validating the bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "bookId is invalid " })
        }
        // Checking if bookId exist or not
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "This bookId does not exist" })
        }

        // Validating  that req body must not be empty       
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send(
                { status: false, message: "There is no data  in body Please provide some details" });
        }

        const { title, excerpt, releasedAt, ISBN } = req.body
        // Validating the various data to be updated in document
        if (title || title == "") {

            if (!validator.isValid(title)) {
                return res.status(400).send({ status: false, message: "please provide title in valid form" })
            }
            checkTitle = await bookModel.findOne({ title });
            if (checkTitle) {
                return res.status(400).send({ status: false, message: "title already present" });
            }
        }
        if (ISBN || ISBN == "") {
             if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) {
            return res.status(400).send({ status: false, message: "Invalid ISBN" })
            }
            checkISBN = await bookModel.findOne({ ISBN });
            if (checkISBN) {
                return res.status(400).send({ status: false, message: "ISBN number already present" });
            }
        }
        if (excerpt || excerpt == "") {
            if (!validator.isValid(excerpt)) {
                return res.status(400).send({ status: false, message: "please provide excerpt in valid form" })
            }
        }
        if (releasedAt || releasedAt == "") {
            if (!validator.isValid(releasedAt)) {
                return res.status(400).send({ status: false, message: "please provide release date in valid form" })
            }
        }

        if (!moment(releasedAt, "YYYY-MM-DD", true).isValid())
            return res.status(400).send({
                status: false,
                message: "Enter a valid date with the format (YYYY-MM-DD).",
            });
        //updating the data
        const updatedBook = await bookModel.findByIdAndUpdate({ _id: bookId },
            { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt },
            { new: true });
        if (updatedBook) {
            res.status(200).send({ status: true, message: "data updated successfully", data: updatedBook })
        }
        else res.status(404).send({ status: false, message: " no such book found" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
    // --------- Delete By BookId API's --------//

const deleteBybookId = async (req, res) => {

    try {
        let bookId = req.params.bookId;

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "please enter valid bookId" });

        let isExistsDocument = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!isExistsDocument) return res.status(404).send({ status: false, message: "Book Document not exists." })

        await bookModel.updateOne({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true }, deletedAt: new Date() })

        return res.status(200).send({ status: true, message: "Book Document deleted successfully." })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createBooks = createBooks;
module.exports.getBooks = getBooks;
module.exports.updateBooks = updateBooks;
module.exports.deleteBybookId = deleteBybookId;
module.exports.getBookById = getBookById;