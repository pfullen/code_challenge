// server.js

// set up ======================================================================
// get all the tools needed
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/code_challenge";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


require('./config/passport')(passport); // pass passport for configuration

// set up express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating  - simpler then React for this challange

// required for passport
app.use(session({
    secret: 'bitPay_code_challange', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load routes and pass in our app and fully configured passport



// TO DO - Refactor to move to routes.js & set up moogose schema

app.post('/message', function(req, res) {

	const router = require("express").Router();
	console.log(req.body);
    var encrypted = req.body;
    var user = req.user._id;

    // need to refactor later to use moogose
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function(err, db) {
    	if (err) throw err;
    	var dbo = db.db("code_challenge");
    	var messageObj = { user: user, message: encrypted};
    	dbo.collection("messages").insertOne(messageObj, function(err, res){
    		if (err) throw err;
    		console.log("1 message inserted");
    		db.close();
    	});
    });


	console.log("The message was received");
	
	// return res
	res.json({success : "Successfully added message", status : 200});

});  


// launch ======================================================================
app.listen(port);
console.log('Running on port ' + port);
