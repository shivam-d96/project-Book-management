const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel")
const validator = require("../Validator/validation")

const reviewsData =async function (req,res){
try{

let {bookId,reviewedBy,reviewedAt,rating,review}=req.body

if (Object.keys(req.body).length==0)
return res.status(400).send({ status: false, message: "pl enter the required information"})


if (!validator.isValid(reviewedBy)) 
return res.status(400).send({ status: false, message: "name is required here." })


if (!validator.isValid(review))
return res.status(400).send({ status: false, message: "review  is required." })
if (!validator.isValid(rating)) 
return res.status(400).send({ status: false, message: "rating is required here." })


if (!validator.isValid(reviewAt))
return res.status(400).send({ status: false, message: "date is required." })
if (!validator.isValid(bookId))
return res.status(400).send({ status: false, message: "bookId is required." })


if (!mongoose.isValidObjectId(req.body.bookId)) 
return res.status(400).send({ status: false, msg: "please enter valid bookId" })

const bookid = await bookModel.findById(req.body.bookId);
if (!bookid) return res.status(400).send({ status: false, msg: "no such bookId present" })

const reviewData = await reviewModel.create(req.body);

return res.status(201).send({ status: true,  message: 'Success' ,data: reviewData })

} catch(error){
return res.status(500).send({status : false,  message: error.message});

}
}



module.exports.reviewsData = reviewsData;