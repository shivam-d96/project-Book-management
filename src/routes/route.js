const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")

// router.post("/register",userController.createUser)
// router.post("/login",userController.userLogin)
router.post("/books",bookController.createBooks)
//router.get("/books",bookController.getBooks)

module.exports = router;
