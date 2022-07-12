const { default: mongoose, now } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/booksModel")
const validator = require("../Validator/validation")

const createReview =async function (req,res){
try{
let data = {reviewedBy,rating,review}=req.body

if(reviewedBy || reviewedBy=="") {
if (!validator.isValid(reviewedBy)) 
return res.status(400).send({ status: false, message: "name of reviewer is required here." })
}else reviewedBy="guest";

if( review || review =="") {
if (!validator.isValid(review))
return res.status(400).send({ status: false, message: "please enter review in string" })
}

if ( typeof(rating) != "number" && 1<=rating<= 5 ) 
return res.status(400).send({ status: false, message: "please enter rating between 1 to 5" })

if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) 
return res.status(400).send({ status: false, msg: "please enter valid bookId" })
const updatedBook = await bookModel.findByIdAndUpdate(req.params.bookId,{$inc: { reviews: 1 }},{new: true});
if (!updatedBook) return res.status(400).send({ status: false, msg: "No book found with this BookId" })
data.reviewedAt = new Date(); 
data.bookId = req.params.bookId;
let createdReview= await reviewModel.create(data);
const bookData = await reviewModel.findById(createdReview["_id"]);
updatedBook["reviewsData"] = createdReview; 

return res.status(201).send({ status: true,  message: 'Success' ,data: updatedBook })

    } catch (error) {console.log(error)
        return res.status(500).send({ status: false, message: error.message });

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
const deleteByreviewId = async (req, res) => {
    try {

        let reviewId = req.params.reviewId;
        let bookId = req.params.bookId;

        //-------------ReviewId valid or not --------------//

        if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Invalid reviewId." })

         //-------------BookId valid or not --------------//

         if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId." })

        let isExistsReview = await reviewModel.findById({ _id: reviewId });

        if (!isExistsReview) return res.status(400).send({ status: false, message: "Reviwe does not exists." });

        let isExistsBook = await bookModel.findById({ _id: bookId });

        if (!isExistsBook) return res.status(400).send({ status: false, message: "Book does not exists." });

        //---------------- Review Document already delete or not ---------//

        if (isExistsReview.isDeleted == true) return res.status(200).send({ status: true, message: "Review Document already deleted." });

        //---------------- Book Document already delete or not ---------//

        if (isExistsBook.isDeleted == true) return res.status(200).send({ status: true, message: " Book Document already deleted." })

        //---------------review delete ------------------//

        await reviewModel.updateOne({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true }, review: "" })

        //---------------book review delete ------------------//

        await bookModel.updateOne({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true }, $inc: { reviews: -1 }, deletedAt: new Date() });

        return res.status(200).send({ status: true, message: "Review and Book review Document Deleted successfully." })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


module.exports.createReview = createReview;
module.exports.deleteByreviewId = deleteByreviewId
module.exports.updateReview = updateReview;


