const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
   bookId: {
      type: mongoose.Schema.Types.ObjectId, required: true,
      ref: "book"
   },
   reviewedBy: { type: String, required: true, default: 'Guest', value: "reviewer's name" },
   reviewedAt: { type: Date, required: true },
   rating: { type: Number, required: true },
   review: { type: String },
   isDeleted: { type: Boolean, default: false }
})
module.exports = mongoose.model("Review", reviewSchema);
