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

if ( typeof(rating) != "number" && 1<=rating<= 5 ) 
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

const updateReview = async function (req,res){
try { 
    let bookId =req.params.bookId;
    let reviewId =req.params.reviewId;
    
    let checkBookId = await bookModel.findById({_id:bookId, isDeleted:false});
    if(!checkBookId &&(!mongoose.Types.ObjectId.isValid(checkBookId)))
    res.status(404).send({status:false,message:"book not found enter valid bookId"})

    let checkReviewId = await reviewModel.findById({_id:reviewId})
    if(!checkReviewId &&(!mongoose.Types.ObjectId.isValid(reviewId)))
    res.status(404).send({status:false,message:"review not found enter valid reviewId"})
    
    let reviewDetails = req.body;
    if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, message: "please enter valid reviewDetails" })
    }
    
    let {reviewedBy,rating,review} =reviewDetails
    if (reviewedBy || reviewedBy == "") {
        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "please enter valid reviewer's name" })
        }
    }
    
    if (rating ||rating == "") {
        if (typeof(rating) != "number" && 1<=rating<= 5) {
            return res.status(400).send({ status: false, message: "please enter rating between 1 to 5" })
        }
    }

     if(review||review == "") {
        if (!validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "please enter valid review" })
        }
    }

    await reviewModel.findOneAndUpdate(reviewId,$set(reviewDetails),{upsert:true})
    const books = await bookModel.findById(bookId);
    books.reviewsData= await reviewModel.find(bookId);
    res.status(200).send({status:true,message:"Books list", data: books});
    } catch(err) {
        res.send({ status:false , message: err.message })
    }
}

module.exports.updateReview = updateReview
module.exports.createReview = createReview;