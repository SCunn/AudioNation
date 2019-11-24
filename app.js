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

const paypal = require('paypal-rest-sdk');

const util = require('util');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AQvhMK-UIHWBkJTiGzpN4GMJWxm_nplLW11dqNpX2BHzSbZGmhcc7QYh8-bLn-84IMdtPjx09qBmlcoW',
  'client_secret': 'EIiVJAMZHtR4OPYydDUx8ShbN8neGKSJjkX4Efbc6rinVB9sTkSt38AjNpS_mHc0o-mfDKtObGj3Uq4k'
});

// Set the template engine
app.set('view engine', 'ejs'); //Tells the app that all pages will be rendered in the ejs syntax unless otherwise stated

app.use(cookieParser()); // read cookies needed for cart and authentication systes
// express-session setup
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


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

////  Alter Table

// app.get('/alter', function(req, res){
// let sql = 'ALTER TABLE users ADD COLUMN admin BOOLEAN DEFAULT FALSE;'
//  let query = db.query(sql, (err, res) => {
//   if(err) throw err;
//  console.log(res); 
//  });
//  res.send("altered");
//  });
 
 
 



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

app.get('/social', isLoggedIn, function(req, res) {
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
    
});

// URL to additem.ejs
app.get('/additem', function(req, res) {
    
    
   res.render("additem",{});
  
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
  
  ///////
  
  
  let sql = 'SELECT * FROM users WHERE Id =  "'+req.user.Id+'" ';
  
  let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);  // sessionID: 'oby9LorrAd5wk_t5MBciAjK4x0oMRcN4',
                            //  session: Session { cookie: [Object], passport: [Object] },
                            //  _passport: { instance: [Object], session: [Object] },
                            //  user: 
                            //   RowDataPacket {
                            //     Id: ,
                            //     username: '',
                            //     email: '',
                            //     password: '',
                            //     admin:  },
       
    });
       
    //console.log(util.inspect(res, false, null, true ));
   
   
  var item_New = { 
      
      Id: parseInt(req.user.Id),
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
  
  //parseFloat(item.price).toFixed(2)
   
  fs.readFile('./data/products.json', 'utf8',  function readfileCallback(err){
        
        if(err) {
            throw(err)
            
        } else {
            
            products.push(item_New); // add the new data to the JSON file
            json = JSON.stringify(products, null, 10); // this line structures the JSON so it is easy on the eye
            fs.writeFile('./data/products.json',json, 'utf8', function(err){ console.log(err)});
            
        }
        
  });
   
    res.redirect('/items');
});





app.get('/edititem/:id', function(req, res) {
    
    // build the information based on changes made by the user
   function chooseItem(mainOne){
     return mainOne.id === parseInt(req.params.id) 
   }
   
   var mainOne = products.filter(chooseItem);
   
   res.render("edititem", {res:mainOne});
    

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

app.post('/bid/:id', function(req, res) {
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
      var d = req.body.image;
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
      
      res.redirect("/item/:id");
})


// // Url to see individual product
app.get('/item/:id', function(req,res){
    
    // build the information based on changes made by the user
   function chooseItem(mainOne){
     return mainOne.id === parseInt(req.params.id) 
   }
   
   var mainOne = products.filter(chooseItem);
   
   res.render("item", {res:mainOne});
   
});




// URL TO delete a product
app.get('/delete/:id', function(req,res){
    

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


app.get('/profile', isLoggedIn, function(req, res) {
    
    var productId = products && products[0].id;
//     function chooseItem(mainOne){
//      return mainOne.id === parseInt(req.params.users_id) 
//   }
   
//   var mainOne = products.filter(chooseItem);
   
//   res.render("item", {res:mainOne});
    
    
    
   res.render("profile", {
       user : req.user, // get the user out of session and pass to template
       products
       //item: req.
   }); 
  
});


// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    
    done(null, user.Id); // Very important to ensure the case if the Id from your database table is the same as it is here

});

// used to deserialize the LOCAL SIGNUP
    passport.deserializeUser(function(Id, done) {   

       db.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        email: req.body.email,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, email, password ) values (?,?,?)";

                    db.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) {
                        newUserMysql.Id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );


/////////////////// Registration Routes /////////////////////////////////////////////////

app.get('/register', function(req, res) {
    res.render("register");
    
});

// process the signup form
app.post('/register', passport.authenticate('local-signup', {
    
	successRedirect : '/profile', // redirect to the secure profile section
	failureRedirect : '/register', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
	
}));

app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

app.get('/login', function(req, res){
    res.render('login',{message:req.flash('loginMessage')});
});
    
// process the login form
app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
});

    // LOCAL LOGIN =============================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

////////////////////// Restrict Access ///////////////////////////////////////////////

// To use, add isLoggedIn after path in get request eg.  app.get('/productssql', isLoggedIn , function(req, res){

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}


///////////////////// Admin //////////////////////////////////////////

function isAdmin(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.user.admin)
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}




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

app.get('/checkout', function(req, res, next) {
      if (!req.session.cart) {              //check if there are products in the cart or not 
        return res.redirect('/cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('checkout', {totalPrice: cart.totalPrice});
});


//app.gloabalAmount = 0;

app.post('/pay', (req, res) => {
    
    //app.globalAmount = req.body.amount;
    
    const create_payment_json = JSON.stringify({
      intent:'sale',
      payer:{
        payment_method:'paypal'
      },
      redirect_urls:{
        return_url:'http://localhost:3000/success',
        cancel_url:'http://localhost:3000/cancel'
      },
      transactions:[{
        amount:{
          total:'10.00',
          currency:'EUR'
        },
        description:'This is the payment transaction description.'
    }]
    });
 
 paypal.payment.create(create_payment_json, function (error, payment) {
     var links = {};
            
      if(error){
        console.error(JSON.stringify(error));
      } else {
          for(let i = 0; i < payment.links.length; i++){
              if(payment.links[i].rel === 'approval_url'){
                  res.redirect(payment.links[i].href);
              }
          }
      }  
  });
});

app.get('/success', function(req, res) {
    const payerId = req.query.PayerID;           // request PayerId & paymentId params from paypal api
    const paymentId = req.query.paymentId;
    
    var execute_payment_json = {
    payer_id: payerId,
    transactions: [{
        amount: {
            currency: 'EUR',
            total: '10.00'
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        //console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
         res.redirect('success', {execute_payment_json});
        }
    });
});

app.get('/cancel', function(req, res){
    res.redirect('/');
})



// This code provides the server port for the application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("App Running!!");
});