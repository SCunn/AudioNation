var express = require("express"); // call the express module whoich is the default provided by node

var app = express();    // declaration of the app 
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');


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

// const db = mysql.createConnection({
//     host: 'den1.mysql3.gear.host',  //address where the mySQL database is hosted
//     user: 'audionation',
//     password: 'Pe9o4zcizy?~',
//     database: 'AUDIONATION'
// });

// // the next section creates the connnection to the database

// db.connect((err) =>{
//     if(err){
//         console.log("go back and check the connection details. Something is wrong.") // console.log is used instead of crashing the app
//         // throw(err)
//     } else {
//         console.log('database connected')
//     }
// });

// this route will create a database table

// app.get('/createtable',function(req,res){
// //     // Create a table that will show Item Id, artist name, album name, image, genre, condition, description, sale type
//     let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Artist varchar(255), Album varchar(255), Image varchar(255), Genre varchar(255), Quality varchar(255), Info varchar(255), Price int, Purpose varchar(255))';
       
    
       
//     let query = db.query(sql, (err,res) => {
        
//          if(err) throw err;
        
//          console.log(res);
        
//     });
    
//     res.send("You created your first DB Table")
    
//  })

//          !!!!!!!!!!!!   drop table  !!!!!!!!!!!!!!!!!

// app.get('/droptable',function(req,res){
    
//     let sql = 'DROP TABLE products';
    
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





//===========SQL===============================================

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


// // post request from the additem.ejs form to database table products
// app.post('/additem', function(req, res) {
    
//     let sampleFile = req.files.sampleFile;
//     filename = sampleFile.name;
    
//     sampleFile.mv('./images/' + filename, function(err){
        
//         if(err)
        
//         return res.status(500).send(err);
//         console.log("Image you are uploading is " + filename)
        
//     })
   
//   function getBigId(records, id){ //function getBigId with parameters records and id
//       var bIg;
      
//       for(var i = 0; i < records.length; i++){ // loops through the item in the JSON file as long as there are records 
//          if(!bIg || parseInt(item[i][id]) > parseInt(bIg[id])); 
//          bIg = records[i];
//       }
//       return bIg;
//   }
// //   // Insert into table that will show Artist, Album, image, genre, condition, description, price, sale type
// //   let sql = 'INSERT INTO products (Artist, Album, Image, Genre, Quality, Info, Price, Purpose) VALUES("'+req.body.artist+'", "'+req.body.album+'", "'+filename+'", "'+req.body.genre+'", "'+req.body.quality+'", "'+req.body.information+'", '+req.body.price+', "'+req.body.purpose+'")';
   
// //   let query = db.query(sql, (err,res) => {
       
// //       if(err) throw err;
       
// //       console.log(res);
// //   });

//     // create a new id for the next JSON item
//   bigUid = getBigId(item, "id"); // calls the getBigId function from above and passes in parameters 
   
//   var add_Id = bigUid.id + 1; // add an id number + 1 larger than the previous id number
   
//   // display result in the console
//   console.log("The New ID is" + add_Id);
   
//   // this section accesses what the user types in the form and passes the infromation
//   //to the JSON file as new data
   
//   var item_New = { 
      
//       id: add_Id, 
//       artist: req.body.artist, 
//       album: req.body.album, 
//       image: filename,
//       genre: req.body.genre,
//       quality: req.body.quality,
//       info: req.body.information,
//       price: req.body.price,
//       purpose: req.body.purpose
//   }
   
//   fs.readFile('./data/products.json', 'utf8',  function readfileCallback(err){
        
//         if(err) {
//             throw(err)
            
//         } else {
            
//             item.push(item_New); // add the new data to the JSON file
//             json = JSON.stringify(item, null, 9); // this line structures the JSON so it is easy on the eye
//             fs.writeFile('./data/products.json',json, 'utf8');
            
//         }
        
//   });
   
//     res.redirect('/profile');
// });

app.get('/edititem/:id', function(req, res) {
    
    // let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'"';
    
    // let query = db.query(sql, (err,result) => {
        
    //     if(err) throw err;
        
    //     console.log(result);
        
      //  res.render('edititem', {result});
    });
    
    
//});

// URL to edititem.ejs


app.post('/edititem/:id', function(req, res) {
    
    
     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    // let sampleFile = req.files.sampleFile;
    // filename = sampleFile.name;
    
    // //use the mv() method to place the file somewhere on the server
    // sampleFile.mv('./images/' + filename, function(err){
        
    //     if(err)
        
    //     return res.status(500).send(err);
    //     console.log("Image you are uploading is " + filename)
    //   // res.redirect('/');
    // });    
    
    
    // // Update the sql database table called products
    // let sql = 'UPDATE products SET Artist = " '+req.body.artist+' ", Album = "'+req.body.album+'", Image = "'+filename+'", Genre = "'+req.body.genre+'", Quality = "'+req.body.quality+'", Info = "'+req.body.information+'", Price = '+req.body.price+', Purpose = "'+req.body.purpose+'" WHERE Id = "'+req.params.id+'" ';
    
    // let query = db.query(sql, (err,res) => {
        
    //     if(err) throw err;
        
    //     console.log(res);
        
    // });
    
    // res.redirect('/items');
    
   
});


// Url to see individual product
app.get('/item/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    //let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'" ';
    
    // let query = db.query(sql, (err,result) => {
        
    //     if(err) throw err;
        
    //     console.log(res);
    //     res.render('items', {result})
    // });
    
   
    
})




// URL TO delete a product
app.get('/delete/:id', function(req,res){
    
    //     let sql = 'DELETE FROM products WHERE Id =  "'+req.params.id+'" ';
    
    // let query = db.query(sql, (err,result) => {
        
    //     if(err) throw err;
        
    //     console.log(result);
        
       
        
    // });
    
    //res.redirect('/items');
    
    
})


app.get('/profile', function(req, res) {
   res.render("profile"); 
  
});



app.get('/checkout', function(req, res) {
    res.render("checkout");
   
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
    res.redirect('items');
    inline();
 
});


// app.get('/cart', function(req, res, next) {
//       if (!req.session.cart) {
//         return res.render('cart', {
//             products: null
//     });
//   }
//   var cart = new Cart(req.session.cart);
//   res.render('cart', {
//     title: 'NodeJS Shopping Cart',
//     products: cart.getItems(),
//     totalPrice: cart.totalPrice
//   });
   
// });

// app.get('/remove/:id', function(req, res, next) {
//   var productId = req.params.id;
//   var cart = new Cart(req.session.cart ? req.session.cart : {});

//   cart.remove(productId);
//   req.session.cart = cart;
//   res.redirect('/cart');
// });






// This code provides the server port for the application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("App Running!!");
});