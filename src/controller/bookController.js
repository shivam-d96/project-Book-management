const { default: mongoose } = require("mongoose");
const validator = require("../Validator/validation")

const getBooks = async function () {
   try 
   { const filterByQuery = { isDeleted: false }
    const { userId, category, subcategory } = req.query;

    if (Object.keys(req.query).length == 0) {
        return res.status(400).send({ status: false, message: "please value in query params to filter the data" })
    }
    if (userId || userId == "") {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, message: "please give valid userId" })
        } else filterByQuery["userId"] = userId;
    }
    if (category || category == "") {
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, message: "please enter valid category" })
        }
        filterByQuery["category"] = category;
    }
    if (subcategory || subcategory == "") {
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "please enter valid category" })
        }
       const subcategoryArr = subcategory.trim().split(",").map( subcategory => subcategory.trim())
        filterByQuery["subcategory"] = { $all :subcategoryArr};
    }

    const books = await bookModel.find(filterByQuery);

    if( books.length==0) return res.status(404).send({ status : false, message:"books not found"});
    return res.status(200).send({ status: true, message:"Books list", data: books })
} catch(err){
    return res.status(500).send({ status: false, message: err.message})
}
}

module.exports.getBooks = getBooks;