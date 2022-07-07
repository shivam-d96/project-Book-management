const express = require('express');
const router = express.Router();
const userController = require("../controller/userController")
const bookController = require("../controller/bookController")

router.post("/register",userController.createUser)
router.post("/login",userController.userLogin)
router.post("/books",bookController.createBooks)
router.get("/books",bookController.getBooks)
<<<<<<< HEAD
router.put("/books/:bookId",bookController.updateBooks)
=======
router.delete("/books/:bookId",bookController.deleteByBooKId);

>>>>>>> d4ebc5a6b559b735acb0096b2236cb9d1977ee0b
module.exports = router;
