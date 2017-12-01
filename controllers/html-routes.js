// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var moment = require("moment");

var isAuthenticated = require("../config/middleware/isAuthenticated");

// Requiring our models
var db = require("../models");

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
        db.User.findAll({}).then(function(dbUser) {
            db.Post.findAll({
                order: [['createdAt', 'DESC']],
                include: [db.Comment]
            }).then(function(dbPost) {
                for(var i=0; i<dbPost.length; i++) {
                    var user = dbUser.find(x => x.id === dbPost[i].UserId);
                    dbPost[i].username = user.username;
                    dbPost[i].lifespan = dbPost[i].timeout - moment().diff(moment(dbPost[i].createdAt), "hours");
                }

                var hbsObject = {
                    usernow: req.user,
                    posts: dbPost
                };

                res.render("mainhtml", hbsObject);
            });
        });

        // res.sendFile(path.join(__dirname, "../public/main.html"));
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

    app.get("/posts", isAuthenticated, function(req, res) {
        res.render("new_post", {});
        // res.sendFile(path.join(__dirname, "../public/new_post.html"));
    });

    app.get("/comments", isAuthenticated, function(req, res) {
        res.render("comments", {});
        // res.sendFile(path.join(__dirname, "../public/comments.html"));
    });

    app.get("/all", isAuthenticated, function(req, res) {
      db.User.findAll({}).then(function(dbUser) {
          db.Post.findAll({
              order: [['createdAt', 'DESC']],
              include: [db.Comment]
          }).then(function(dbPost) {
              for(var i=0; i<dbPost.length; i++) {
                  var user = dbUser.find(x => x.id === dbPost[i].UserId);
                  dbPost[i].username = user.username;
                  dbPost[i].lifespan = dbPost[i].timeout - moment().diff(moment(dbPost[i].createdAt), "hours");
              }

              var hbsObject = {
                  usernow: req.user,
                  posts: dbPost
              };

              res.render("mainhtml", hbsObject);
          });
      });
        // res.sendFile(path.join(__dirname, "../public/new_post.html"));
    });

    app.get("/life", isAuthenticated, function(req, res) {
      db.User.findAll({}).then(function(dbUser) {
          db.Post.findAll({
              where: {category: "life"},
              order: [['createdAt', 'DESC']],
              include: [db.Comment]
          }).then(function(dbPost) {
              for(var i=0; i<dbPost.length; i++) {
                  var user = dbUser.find(x => x.id === dbPost[i].UserId);
                  dbPost[i].username = user.username;
                  dbPost[i].lifespan = dbPost[i].timeout - moment().diff(moment(dbPost[i].createdAt), "hours");
              }

              var hbsObject = {
                  usernow: req.user,
                  posts: dbPost
              };

              res.render("life", hbsObject);
          });
      });
        // res.sendFile(path.join(__dirname, "../public/new_post.html"));
    });
    app.get("/funny", isAuthenticated, function(req, res) {
      db.User.findAll({}).then(function(dbUser) {
          db.Post.findAll({
              where: {category: "funny"},
              order: [['createdAt', 'DESC']],
              include: [db.Comment]
          }).then(function(dbPost) {
              for(var i=0; i<dbPost.length; i++) {
                  var user = dbUser.find(x => x.id === dbPost[i].UserId);
                  dbPost[i].username = user.username;
                  dbPost[i].lifespan = dbPost[i].timeout - moment().diff(moment(dbPost[i].createdAt), "hours");
              }

              var hbsObject = {
                  usernow: req.user,
                  posts: dbPost
              };

              res.render("funny", hbsObject);
          });
      });
        // res.sendFile(path.join(__dirname, "../public/new_post.html"));
    });

    app.get("/gaming", isAuthenticated, function(req, res) {
      db.User.findAll({}).then(function(dbUser) {
          db.Post.findAll({
              where: {category: "gaming"},
              order: [['createdAt', 'DESC']],
              include: [db.Comment]
          }).then(function(dbPost) {
              for(var i=0; i<dbPost.length; i++) {
                  var user = dbUser.find(x => x.id === dbPost[i].UserId);
                  dbPost[i].username = user.username;
                  dbPost[i].lifespan = dbPost[i].timeout - moment().diff(moment(dbPost[i].createdAt), "hours");
              }

              var hbsObject = {
                  usernow: req.user,
                  posts: dbPost
              };

              res.render("gaming", hbsObject);
          });
      });
        // res.sendFile(path.join(__dirname, "../public/new_post.html"));
    });

    app.get("/random", isAuthenticated, function(req, res) {
      db.User.findAll({}).then(function(dbUser) {
          db.Post.findAll({
              where: {category: "random"},
              order: [['createdAt', 'DESC']],
              include: [db.Comment]
          }).then(function(dbPost) {
              for(var i=0; i<dbPost.length; i++) {
                  var user = dbUser.find(x => x.id === dbPost[i].UserId);
                  dbPost[i].username = user.username;
                  dbPost[i].lifespan = dbPost[i].timeout - moment().diff(moment(dbPost[i].createdAt), "hours");
              }

              var hbsObject = {
                  usernow: req.user,
                  posts: dbPost
              };

              res.render("random", hbsObject);
          });
      });
        // res.sendFile(path.join(__dirname, "../public/new_post.html"));
    });

};
