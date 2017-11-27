// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");

var session = require("express-session");
var passport = require("./config/passport");

const aws = require('aws-sdk');
require('dotenv').config();

aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

aws.config.region = "us-west-2";	// US West (Oregon)

const S3_BUCKET = process.env.S3_BUCKET;

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

var http = require('http').Server(app);
var io = require('socket.io')(http);

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());

//Keep an eye on this - may need to be set to 'false'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
// =============================================================
require("./controllers/html-routes.js")(app);
require("./controllers/api-routes.js")(app);
require("./controllers/live_chat.js")(io);

app.get('/sign-s3', (req, res) => {
	const s3 = new aws.S3();
	const fileName = req.query['file-name'];
	const fileType = req.query['file-type'];
	const s3Params = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if(err){
			console.log(err);
			return res.end();
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		};
		res.json(returnData);
	});
});

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ /*force: true*/ }).then(function() {
	http.listen(PORT, function() {
		console.log("App listening on PORT " + PORT);
	});

	require("./controllers/self-timers.js")(io);
});

