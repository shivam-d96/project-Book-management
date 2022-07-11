const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
<<<<<<< HEAD
   bookId: {
      type: mongoose.Schema.Types.ObjectId, required: true,
      ref: "book"
   },
   reviewedBy: { type: String, required: true, default: 'Guest', value: "reviewer's name" },
   reviewedAt: { type: Date, required: true },
   rating: { type: Number, range: "1 to 5", required: true },
   review: { type: String },
   isDeleted: { type: Boolean, default: false }
})
module.exports = mongoose.model("Review", reviewSchema);
=======
    bookId: {type: mongoose.Schema.Types.ObjectId, required:true,
       ref : "book"},
    reviewedBy: {type:String, required:true, default: 'Guest'},
    reviewedAt: {type:Date, required: true},
    rating: {type:Number,range:" 1 to 5", required: true},
    review: {type:String},
    isDeleted: {type:Boolean, default: false}
  })
>>>>>>> e32b767be525ae776ca2cda7e2fa406463741af9
