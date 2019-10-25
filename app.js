var express = require("express"); // call the express module whoich is the default provided by node

var app = express();    // declaration of the app 


// Set the template engine
app.set('view engine', 'ejs'); //Tells the app that all pages will be rendered in the jade syntax unless otherwise stated

app.use(express.static("views"));// allows access to views folder
app.use(express.static("style")); // Allows access to the styles folder
app.use(express.static("images")); // Allows access to the images folder


// body parser to get information
var fs = require('fs');
var bodyParser = require("body-parser"); // call body parser module and make use of it
app.use(bodyParser.urlencoded({extended:true}));


// +++++++ JSON ++++++++++

var social = require("./model/social.json"); // allow the app to access the social.json file

app.get('/social', function(req, res) {
    res.render("social",{social});
    console.log("social page loaded, social page json data included");
});
// set up middleware function invoking the request and response function
app.get('/', function(req, res) {
res.render("index"); // renders the index page in the web browser
console.log("Home Page Loaded"); // used to output activity in the console
});


app.get('/items', function(req, res) {
    res.render("items");
    console.log("items page loaded");
});

app.get('/additem', function(req, res) {
   res.render("additem");
   console.log("additem page loaded");
});

app.get('/profile', function(req, res) {
   res.render("profile"); 
   console.log("profile page loaded");
});

app.get('/cart', function(req, res) {
    res.render('cart');
    console.log("cart page loaded");
})

app.get('/checkout', function(req, res) {
    res.render("checkout");
    console.log("Checkout page loaded");
});

app.get('/register', function(req, res) {
    res.render("register");
    console.log("registration page");
});



// This code provides the server port for the application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("I'll be having some of that!!");
});