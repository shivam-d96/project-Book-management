const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

  title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, reqired: true, unique: true, trim: true },
  password: { type: String, required: true },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String }
  }

}, { timestamps: true });

module.exports = mongoose.model("user", userSchema)      