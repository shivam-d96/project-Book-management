const { default: mongoose, now } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel")
const validator = require("../Validator/validation")

const createReview =async function (req,res){
try{
let data = {reviewedBy,rating,review}=req.body

if (!validator.isValid(reviewedBy)) 
return res.status(400).send({ status: false, message: "name of reviewer is required here." })

if( review || review =="") {
if (!validator.isValid(review))
return res.status(400).send({ status: false, message: "please enter review in string" })
}

if (typeof(rating) != "number" && 1<=rating<= 5 ) 
return res.status(400).send({ status: false, message: "please enter rating between 1 to 5" })

if (!mongoose.isValidObjectId(req.params.bookId)) 
return res.status(400).send({ status: false, msg: "please enter valid bookId" })
const updatedBook = await bookmodel.findByIdAndUpdate(req.params.bookId,{ reviews: ++reviews},{new: true});
if (!updatedBook) return res.status(400).send({ status: false, msg: "No book found with this BookId" })
data.reviewedAt = new Date(); 
 await reviewModel.create(data);
const bookData = await reviewModel.find({bookId : req.params.bookId});
updatedBook.reviewsData = bookData; 

return res.status(201).send({ status: true,  message: 'Success' ,data: updatedBook })

} catch(error){
return res.status(500).send({status : false,  message: error.message});

}
}



module.exports.createReview = createReview;