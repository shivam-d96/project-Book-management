const jwt = require("jsonwebtoken")
const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")
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
                    jwt.verify(token, "group-69")
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
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.authenticate = authenticate