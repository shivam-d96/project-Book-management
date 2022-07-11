const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bookModel = require("../models/booksModel");


//================================================Authentication======================================================

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]

        if (!token) {
            res.status(400).send({ status: false, msg: "token must be present" })
        }
        else {
            const validToken = jwt.decode(token)
            if (validToken) {
                try {
                    jwt.verify(token, "projectGroup69-3")
                    next()
                }
                catch (error) {
                    res.status(401).send({ status: false, msg: "Invalid token" })
                }
            }
            else {
                res.status(400).send({ status: false, msg: "Invalid token" })
            }
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//================================================Authorisation======================================================
const authorisation = async (req, res, next) => {

    try {
        let bookid = req.params.bookId;

        let token = req.headers["x-api-key"];

        if (!mongoose.isValidObjectId(bookid)) return res.status(400).send({ status: false, msg: "Please enter vaild bookId." });

        let BookDetails =await bookModel.findById(bookid)
      console.log(BookDetails)
        const tokenDecoded = jwt.verify(token, "projectGroup69-3");
      console.log(tokenDecoded)
        if (!BookDetails) return res.status(404).send({ status: false, msg: 'No such book exists' })

        if (BookDetails.userId != tokenDecoded.userId) return res.status(403).send({ status: false, msg: "User logged is not allowed to modify the requested users data" })

        next();

    } catch (error) {
        return res.status(500).send({ status: false,  message: error.message })
    }

}

module.exports.authenticate = authenticate
module.exports.authorisation = authorisation
