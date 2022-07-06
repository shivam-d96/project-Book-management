const { default: mongoose } = require("mongoose");
const bookModel = require("../models/booksModel");
const validator = require("../Validator/validation")

const userModel = require("../models/userModel")
//const isValid = require("../Validator/validation");

const createBooks = async (req, res) => {
    try {

        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = req.body;

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "fill all fields" })

        if (!validator.isValid(title)) return res.status(400).send({ status: false, message: "title is required" })

        if (!validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "excerpt is required" })

        if (!validator.isValid(userId)) return res.status(400).send({ status: false, message: "userId required" })

        if (!validator.isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN number required" })

        if (!validator.isValid(category)) return res.status(400).send({ status: false, message: "title is required" })

        if (!validator.isValid(subcategory)) return res.status(400).send({ status: false, message: "subcategory is required" })

        if (!reviews) return res.status(400).send({ status: false, message: "subcategory is required" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "title is required" })

        //  if(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return res.status(400).send({status: false, message : "Invalid date format."})

        if (!mongoose.isValidObjectId(req.body.userId)) return res.status(400).send({ status: false, msg: "please enter valid userId" })

        const userid = await userModel.findById(req.body.userId);
        if (!userid) return res.status(400).send({ status: false, msg: "no such userId present" })

        const bookData = await bookModel.create(req.body);

        return res.status(201).send({ status: true, message: 'Success', data: bookData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });

    }
}

const getBooks = async function () {
    try {
        const filterByQuery = { isDeleted: false }
        const { userId, category, subcategory } = req.query;

        if (Object.keys(req.query).length == 0) {
            return res.status(400).send({ status: false, message: "please value in query params to filter the data" })
        }
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
            filterByQuery["subcategory"] = { $all: subcategoryArr };
        }

        const books = await bookModel.find(filterByQuery);

        if (books.length == 0) return res.status(404).send({ status: false, message: "books not found" });
        return res.status(200).send({ status: true, message: "Books list", data: books })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createBooks = createBooks;

module.exports.getBooks = getBooks;
