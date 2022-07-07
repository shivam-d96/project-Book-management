const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bookModel = ("../models/booksModel");

const authorisation = async (req, res, next) => {

    try {
        let bookId = req.params.bookId;

        let token = req.headers["x-api-key"];

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "Please enter vaild bookId." });

        let BookDetails = await bookModel.findById(bookId);

        const tokenDecoded = jwt.verify(token, "group-69");

        if (!BookDetails) return res.status(404).send({ status: false, msg: 'No such book exists' })

        if (BookDetails.userId != tokenDecoded._id) return res.status(403).send({ status: false, msg: "User logged is not allowed to modify the requested users data" })

        next();

    } catch (error) {
        return res.status(500).send({ status: false, messagee: error.messagee })
    }

}

