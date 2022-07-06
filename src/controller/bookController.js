const bookModel = require("../models/booksModel");
const userModel = require("../models/userModel")
const isValid = require("../Validator/validation");

const createBooks = async (req,res) =>{
    try{

        let { title, excerpt, userId,ISBN,category,subcategory,reviews,releasedAt } = req.body ;

        if (Object.keys(req.body ).length == 0) return res.status(400).send({ status: false, msg: "fill all fields" })
        
        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is required" })

        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "excerpt is required" })

        if (!isValid(userId)) return res.status(400).send({ status: false, message: "userId required" })

        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN number required" })

        if (!isValid(category)) return res.status(400).send({ status: false, message: "title is required" })

        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "subcategory is required" })

        if (!reviews) return res.status(400).send({ status: false, message: "subcategory is required" })
        
        if (!releasedAt) return res.status(400).send({ status: false, message: "title is required" })

      //  if(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return res.status(400).send({status: false, message : "Invalid date format."})

        if (!mongoose.isValidObjectId(req.body.userId)) return res.status(400).send({ status: false, msg: "please enter valid userId" })

        const userid = await userModel.findById(req.body.userId);
        if (!userid) return res.status(400).send({ status: false, msg: "no such userId present" })

        const bookData = await bookModel.create(req.body);

        return res.status(201).send({ status: true,  message: 'Success' ,data: bookData })

    }catch(error){
        return res.status(500).send({status : false,  message: error.message});
 
    }
}
module.exports.createBooks = createBooks;