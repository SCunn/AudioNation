var express = require("express"); // call the express module whoich is the default provided by node

var app = express();    // declaration of the app 


// Set the template engine
app.set('view engine', 'ejs'); //Tells the app that all pages will be rendered in the jade syntax unless otherwise stated

app.use(express.static("views"));// allows access to views folder
app.use(express.static("style")); // Allows access to the styles folder


// body parser to get information
var fs = require('fs');
var bodyParser = require("body-parser"); // call body parser module and make use of it
app.use(bodyParser.urlencoded({extended:true}));


// set up middleware function invoking the request and response function
app.get('/', function(req, res) {
res.render("index"); // renders the index page in the web browser
console.log("Home Page Loaded"); // used to output activity in the console
});


// This code provides the server port for the application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("I'll be having some of that!!");
});