var express = require("express"); // call the express module whoich is the default provided by node

var app = express();    // declaration of the app 


// Set the template engine
app.set('view engine', 'ejs'); //Tells the app that all pages will be rendered in the ejs syntax unless otherwise stated

app.use(express.static("views"));// allows access to views folder
app.use(express.static("style")); // Allows access to the styles folder
app.use(express.static("images")); // Allows access to the images folder


// Initiate mysql here
var mysql = require('mysql');


// body parser to get information
var fs = require('fs');
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

// the next section creates the connnection to the database

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


app.get('/items', function(req,res) {
    
    let sql = 'SELECT * FROM products';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render("items", {result});
    });
    
});

// URL to additem.ejs
app.get('/additem', function(req, res) {
   res.render("additem");
  
});


// post request from the additem.ejs form to database table products
app.post('/additem', function(req, res) {
    
    let sampleFile = req.files.sampleFile;
    filename = sampleFile.name;
    
    sampleFile.mv('./images/' + filename, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + filename)
        
    })
   
   
   // Insert into table that will show Artist, Album, image, genre, condition, description, price, sale type
   let sql = 'INSERT INTO products (Artist, Album, Image, Genre, Quality, Info, Price, Purpose) VALUES("'+req.body.artist+'", "'+req.body.album+'", "'+filename+'", "'+req.body.genre+'", "'+req.body.quality+'", "'+req.body.information+'", '+req.body.price+', "'+req.body.purpose+'")';
   
   let query = db.query(sql, (err,res) => {
       
       if(err) throw err;
       
       console.log(res);
   });
    res.redirect('/profile');
});

app.get('/edititem/:id', function(req, res) {
    
    let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'"';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('edititem', {result});
    });
    
    
});

// URL to edititem.ejs


app.post('/edititem/:id', function(req, res) {
    
    
     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    filename = sampleFile.name;
    
    //use the mv() method to place the file somewhere on the server
    sampleFile.mv('./images/' + filename, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + filename)
       // res.redirect('/');
    });    
    
    
    // Update the sql database table called products
    let sql = 'UPDATE products SET Artist = " '+req.body.artist+' ", Album = "'+req.body.album+'", Image = "'+filename+'", Genre = "'+req.body.genre+'", Quality = "'+req.body.quality+'", Info = "'+req.body.information+'", Price = '+req.body.price+', Purpose = "'+req.body.purpose+'" WHERE Id = "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/items');
    
   
});


// Url to see individual product
app.get('/item/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(res);
        res.render('items', {result})
    });
    
   
    
})




// URL TO delete a product
app.get('/delete/:id', function(req,res){
    
        let sql = 'DELETE FROM products WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
       
        
    });
    
    res.redirect('/items');
    
    
})


app.get('/profile', function(req, res) {
   res.render("profile"); 
  
});

app.get('/cart', function(req, res) {
    res.render('cart');
   
})

app.get('/checkout', function(req, res) {
    res.render("checkout");
   
});

app.get('/register', function(req, res) {
    res.render("register");
    
});



// This code provides the server port for the application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    console.log("I'll be having some of that!!");
});