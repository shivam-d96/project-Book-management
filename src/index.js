const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
const multer = require('multer')
app.use(multer().any());
app.use(bodyParser.json()); 


mongoose.connect("mongodb+srv://shivanishukla:anupam1985@cluster0.joqko.mongodb.net/group69Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("mongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
