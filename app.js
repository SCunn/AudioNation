var express = require("express"); // call the express module whoich is the default provided by node

var app = express();    // declaration of the app 
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var localStorage = require('node-localstorage');
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');

const util = require('util');


// Set the template engine
app.set('view engine', 'ejs'); //Tells the app that all pages will be rendered in the ejs syntax unless otherwise stated

app.use(cookieParser());
// express-session setup
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static("views"));// allows access to views folder
app.use(express.static("style")); // Allows access to the styles folder
app.use(express.static("images")); // Allows access to the images folder

// cart function res.locals is an object passed to engine
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

var Cart = require('./model/cart'); // path to cart.js

// Initiate mysql here
var mysql = require('mysql');


// body parser to get information
var fs = require('fs');  // The Node.js file system module allows you to work with the file system on your computer.
var bodyParser = require("body-parser"); // call body parser module and make use of it
app.use(bodyParser.urlencoded({extended:true}));



// Initiate file uploader
const fileUpload = require('express-fileupload');
app.use(fileUpload());


// -----------SQL with Gearhost database-----------

const db = mysql.createConnection({
    host: 'den1.mysql3.gear.host',  //address where the mySQL database is hosted
    user: 'audionation',
    password: 'Pe9o4zcizy?~',
    database: 'AUDIONATION'
});

// // the next section creates the connnection to the database

db.connect((err) =>{
    if(err){
        console.log("go back and check the connection details. Something is wrong.") // console.log is used instead of crashing the app
        // throw(err)
    } else {
        console.log('database connected')
    }
});

// this route will create a database table

// app.get('/createtable',function(req,res){
// //     // Create a table that will show Item Id, artist name, album name, image, genre, condition, description, sale type
//     let sql = 'CREATE TABLE products (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, artist varchar(255), album varchar(255), image varchar(255), genre varchar(255), quality varchar(255), info varchar(255), price int, purpose varchar(255))';
       
    
       
//     let query = db.query(sql, (err,res) => {
        
//          if(err) throw err;
        
//          console.log(res);
        
//     });
    
//     res.send("You created your first DB Table")
    
//  })

//CREATE TABLE users Id username, email, password

// app.get('/createusers', function(req, res){
// let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255), email varchar(255), password varchar(255));'
// let query = db.query(sql, (err,res) => {
//  if(err) throw err;
//  console.log(res);
// });
    
// res.send("USER TABLe created");
// });


//          !!!!!!!!!!!!   drop table  !!!!!!!!!!!!!!!!!

// app.get('/droptable',function(req,res){
//     let sql = 'DROP TABLE tablename';
    
//     let query = db.query(sql, (err,res) => {
        
//         if(err) throw err;
        
//         console.log(res);
//     });
    
//     res.send("Table Dropped");
// });

// ==========This route will create a product ============================ 

// app.get('/insert',function(req,res){
//     // Insert Into table Item Id, artist name, album name, image, genre, condition, description, sale type, price
//     let sql = 'INSERT INTO products (Artist, Album, Image, Genre, Quality, Info, Price, Purpose) VALUES("Soundgarden", "Badmotorfinger", "bmf.jpg", "Alt-Rock/Alt-Metal", "Good", "Released 1991, 3rd studio album", 18, "Auction")';
    

    
//     let query = db.query(sql, (err,res) => {
        
//          if(err) throw err;
        
//          console.log(res);
        
//     });
    
//     res.send("You created your Item");
    
//  });


// +++++++ JSON ++++++++++

var social = require("./data/social.json"); // allow the app to access the social.json file
var products = require("./data/products.json");

app.get('/social', function(req, res) {
    res.render("social",{social});
    console.log("social page loaded, social page json data included");
});
// set up middleware function invoking the request and response function
app.get('/', function(req, res) {
res.render("index"); // renders the index page in the web browser
console.log("Home Page Loaded"); // used to output activity in the console
});





//===========CRUD products JSON===============================================

app.get('/items', function(req,res) {
    
    var productId = products && products[0].id;
    res.render("items",{products});
    // let sql = 'SELECT * FROM products';
    
    //let query = db.query(sql, (err,result) => {
        
    //     if(err) throw err;
        
    //     console.log(result);
        
    //     res.render("items", {result});
    //});
    
});

// URL to additem.ejs
app.get('/additem', function(req, res) {
   res.render("additem");
  
});


// post request from the additem.ejs form to database table products
app.post('/additem', function(req, res) {
    
     let sampleFile = req.files.sampleFile;
    image = sampleFile.name;
    
    sampleFile.mv('./images/' + image, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + image)
       // res.redirect('/');
    });
   
  function getBigId(records, id){ //function getBigId with parameters records and id
      var bIg;
      
      for(var i = 0; i < records.length; i++){ // loops through the item in the JSON file as long as there are records 
         if(!bIg || parseInt(products[i][id]) > parseInt(bIg[id])); 
         bIg = records[i];
      }
      return bIg;
  }


    // create a new id for the next JSON item
  bigUid = getBigId(products, "id"); // calls the getBigId function from above and passes in parameters 
   
  var add_Id = bigUid.id + 1; // add an id number + 1 larger than the previous id number
   
  // display result in the console
  console.log("The New ID is" + add_Id);
   
  // this section accesses what the user types in the form and passes the infromation
  //to the JSON file as new data
   
  var item_New = { 
      
      id: add_Id, 
      artist: req.body.artist, 
      album: req.body.album, 
      image: image,
      genre: req.body.genre,
      quality: req.body.quality,
      info: req.body.information,
      price: req.body.price,
      purpose: req.body.purpose
  }
   
  fs.readFile('./data/products.json', 'utf8',  function readfileCallback(err){
        
        if(err) {
            throw(err)
            
        } else {
            
            products.push(item_New); // add the new data to the JSON file
            json = JSON.stringify(products, null, 9); // this line structures the JSON so it is easy on the eye
            fs.writeFile('./data/products.json',json, 'utf8');
            
        }
        
  });
   
    res.redirect('/profile');
});

app.get('/edititem/:id', function(req, res) {
    
    // build the information based on changes made by the user
   function chooseItem(mainOne){
     return mainOne.id === parseInt(req.params.id) 
   };
   
   var mainOne = products.filter(chooseItem);
   
   res.render("edititem", {res:mainOne});
    
    // let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'"';
    
    // let query = db.query(sql, (err,result) => {
        
    //     if(err) throw err;
        
    //     console.log(result);
        
      //  res.render('edititem', {result});
    });
    
    
//});

// URL to edititem.ejs


app.post('/edititem/:id', function(req, res) {
    
    
    //The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    image = sampleFile.name;
    
    //use the mv() method to place the file somewhere on the server
    sampleFile.mv('./images/' + image, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + image)
      // res.redirect('/');
    });    
    
     // stringify the JSON data so it can be called as a variable and modified when needed
      var json = JSON.stringify(products);
      
   //declare the incoming id from the url as a variable
      var keyFind = parseInt(req.params.id);
   
   
   // use predetermined JavaScript functionality to map the data and find the information needed
      var index = products.map(function(products) {return products.id}).indexOf(keyFind);
    
   // These lines collect content from the body where the user fills in the form
    
      var a = parseInt(req.params.id);
      var b = req.body.artist;
      var c = req.body.album;
      var d = image;
      var e = req.body.genre;
      var f = req.body.quality;
      var g = req.body.information;
      var h = req.body.price;
      var i = req.body.purpose;
    
   // The next section pushes new data to the json
    
      products.splice(index, 1, {artist: b, album: c, image: d, genre: e, quality: f, information: g, price: h, purpose: i, id: a });
      
   // this reformats the JSON and pushes it back to the file 
      json = JSON.stringify(products, null, 9); // Structures the JSON to be more legible
      fs.writeFile('./data/products.json',json, 'utf8', function(){});
      
      res.redirect("/items");

   
});


// // Url to see individual product
app.get('/item/:id', function(req,res){
    
    // build the information based on changes made by the user
   function chooseItem(mainOne){
     return mainOne.id === parseInt(req.params.id) 
   }
   
   var mainOne = products.filter(chooseItem);
   
   res.render("item", {res:mainOne});
   
//     // Create a table that will show product Id, name, price, image and sporting activity
//     let sql = 'SELECT * FROM products WHERE id = "'+req.params.id+'" ';
    
//     let query = db.query(sql, (err,result) => {
        
//         if(err) throw err;
        
//         console.log(res);
//         res.render('items', {result})
//     });
    
   
    
});




// URL TO delete a product
app.get('/delete/:id', function(req,res){
    
    //     let sql = 'DELETE FROM products WHERE Id =  "'+req.params.id+'" ';
    
    // let query = db.query(sql, (err,result) => {
        
    //     if(err) throw err;
        
    //     console.log(result);
        
       
        
    // });
    
    //res.redirect('/items');
       // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(products);
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id);
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = products.map(function(products) {return products.id}).indexOf(keyToFind);
    

    products.splice(index, 1);
    
  
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(products, null, 9); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./data/products.json',json, 'utf8', function(){});
    
    res.redirect("/items"); 
    
})


app.get('/profile', function(req, res) {
   res.render("profile"); 
  
});





app.get('/register', function(req, res) {
    res.render("register");
    
});


////////////////////// Cart //////////////////////////////////////////////////////////


app.get('/addtocart/:id', function(req, res, next) {
    
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});  // New Cart will be created if there is a new Item, else old session is used
    var product = products.filter(function(item) {  // filter products json and return item.id
        return item.id == productId;
    });
    cart.add(product[0], productId);
    req.session.cart = cart;
    console.log(req.session.cart);
    //util used here
    //console.log(util.inspect(product, false, null, true ))
    res.redirect('/items');
    
 
});


app.get('/cart', function(req, res, next) {
      if (!req.session.cart) {              //check if there are products in the cart or not 
        return res.render('cart', {
            products: null
    });
  }
  // If there are any products added, create a new cart based on the stored session
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    products: cart.getItems(),      // Initiates array from cart.js cart.getItems function
    totalPrice: cart.totalPrice
  });
   
});



app.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});


//////////////////// Checkout ////////////////////////////////////

// app.get('/checkout', function(req, res, next) {
//       if (!req.session.cart) {              //check if there are products in the cart or not 
//         return res.redirect('/cart');
//   }
//   var cart = new Cart(req.session.cart);
//   res.render('checkout', {total: cart.totalPrice});
// });


// This code provides the server port for the application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("App Running!!");
});