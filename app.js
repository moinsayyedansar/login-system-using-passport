let express = require("express")
let app = express()
let route = require("./userroute")

let mongoose = require("mongoose")
let connection = mongoose.connect(`mongodb+srv://moinsayyed691:moin123@cluster1.gvkspgt.mongodb.net/demo?retryWrites=true&w=majority`)
// "mongodb://localhost:27017/demouser"

connection.then(()=>{
    console.log("connection successfull")
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use("/",route)

app.listen(3000)