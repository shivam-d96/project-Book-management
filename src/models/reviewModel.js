const mongoose = require("mongoose")
 
const reviewSchema = new mongoose.Schema({
    bookId: {type: mongoose.Schema.Types.ObjectId, required:true,
       ref : "book"},
    reviewedBy: {type:String, required:true, default: 'Guest'},
    reviewedAt: {type:Date, required: true},
    rating: {type:Number,range:" 1 to 5", required: true},
    review: {type:String},
    isDeleted: {type:Boolean, default: false}
  })