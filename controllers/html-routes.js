// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

var isAuthenticated = require("../config/middleware/isAuthenticated");

// Routes
// =============================================================
module.exports = function(app) {

    app.get("/", function(req, res) {
        // If the user already has an account send them to the main page
        if (req.user) {
            res.redirect('/main');
        }
        res.sendFile(path.join(__dirname, "../public/sign_up.html"));
    });

    app.get("/signup", function(req, res) {
        // If the user already has an account send them to the main page
        if (req.user) {
            res.redirect('/main');
        }
        res.sendFile(path.join(__dirname, "../public/sign_up.html"));
    });

    app.get("/login", function(req, res) {
        // If the user already has an account send them to the main page
        if (req.user) {
            res.redirect('/main');
        }
        res.sendFile(path.join(__dirname, "../public/log_in.html"));
    });

    app.get("/login-failureRedirect", function(req, res) {
        res.status(503).json(req.flash('error'));
    });    

    // Here we've add our isAuthenticated middleware to this route.
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    app.get("/main", isAuthenticated, function(req, res) {
        res.sendFile(path.join(__dirname, "../public/main.html"));
    });

    app.get("/livechat", /*isAuthenticated,*/ function(req, res) {
        res.sendFile(path.join(__dirname, "../public/live_chat.html"));
    });

    app.get("/newchat", /*isAuthenticated,*/ function(req, res) {
        res.sendFile(path.join(__dirname, "../public/new_chat.html"));
    });

    app.get("/uploads3", /*isAuthenticated,*/ function(req, res) {
        res.sendFile(path.join(__dirname, "../public/upload_S3.html"));
    });
    
    app.get("/comments", /*isAuthenticated,*/ function(req, res) {
        res.sendFile(path.join(__dirname, "../public/comments.html"));
    });

    app.get("/new_post", /*isAuthenticated,*/ function(req, res) {
        res.sendFile(path.join(__dirname, "../public/new_post.html"));
    });

};

