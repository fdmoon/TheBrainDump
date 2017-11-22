// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
var passport = require("../config/passport");

// Routes
// =============================================================
module.exports = function(app) {
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the main page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json("/main");
    });

    // Route for signing up a user.
    app.post("/api/signup", function(req, res) {
        db.User.create(req.body).then(function(dbUser) {
            res.redirect(307, "/api/login");
        }).catch(function(err) {
            res.status(500).json(err);
        });
    });

    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    // GET routes - find
    app.get("/api/users", function(req, res) {
        db.User.findAll({
            include: [{
               model: db.Post,
                include: [db.Comment]
            }]
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/api/users/:id", function(req, res) {
        var userid = req.params.id;

        db.User.findOne({
            where: {
                id: userid
            },
            include: [{
               model: db.Post,
                include: [db.Comment]
            }]
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/api/users/nocomment/:userid", function(req, res) {
        db.User.findOne({
            where: {
                id: req.params.userid
            },
            include: [db.Post]
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/api/users/name/:name", function(req, res) {
        db.User.findOne({
            where: {
                username: req.params.name
            },
            include: [{
               model: db.Post,
                include: [db.Comment]
            }]
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/api/posts", function(req, res) {
        db.Post.findAll({
            include: [db.Comment]
        }).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    app.get("/api/posts/nocomment", function(req, res) {
        db.Post.findAll({}).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    app.get("/api/posts/:id", function(req, res) {
        var postid = req.params.id;

        db.Post.findOne({
            where: {
                id: postid
            },
            include: [db.Comment]
        }).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    app.get("/api/posts/category/:category", function(req, res) {
        db.Post.findAll({
            where: {
                category: req.params.category
            },
            include: [db.Comment]
        }).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    app.get("/api/comments/:postid", function(req, res) {
        db.Comment.findAll({
            where: {
                PostId: req.params.postid
            }
        }).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    // POST routes - create
    app.post("/api/posts", function(req, res) {
        db.Post.create(req.body).then(function(dbPost) {
            res.json(dbPost);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/comments", function(req, res) {
        db.Comment.create(req.body).then(function(dbComment) {
            res.json(dbComment);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // PUT routes - update
    app.put("/api/posts", function(req, res) {
        db.Post.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }
        ).then(function(dbPost) {
            res.json(dbPost);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.put("/api/posts/like/:id", function(req, res) {
        db.Post.update(
            {
                like_count: db.Sequelize.literal('like_count + 1')
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(function(dbPost) {
            res.json(dbPost);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.put("/api/posts/dislike/:id", function(req, res) {
        db.Post.update(
            {
                dislike_count: db.Sequelize.literal('dislike_count + 1')
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(function(dbPost) {
            res.json(dbPost);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.put("/api/comments", function(req, res) {
        db.Comment.update(
            req.body,
            {
                where: {
                    id: req.body.id
                }
            }
        ).then(function(dbComment) {
            res.json(dbComment);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // DELETE routes - delete
    app.delete("/api/users/:id", function(req, res) {
        var userid = req.params.id;
        var postidOfUser = [];

        db.Post.findAll({
            where: {
                UserId: userid
            }
        }).then(function(dbPost) {
            for(i=0; i<dbPost.length; i++) {
                postidOfUser.push(dbPost[i].id);
            }

            db.Comment.destroy({
                where: {
                    PostId: postidOfUser
                }
            }).then(function(delCnt) {
                db.Post.destroy({
                    where: {
                        UserId: userid
                    }
                }).then(function(delCnt) {
                    db.User.destroy({
                        where: {
                            id: userid
                        }
                    }).then(function(delCnt) {
                        res.json(delCnt);
                    }).catch(function(err) {
                        res.json(err);
                    });
                }).catch(function(err) {
                    res.json(err);
                });
            }).catch(function(err) {
                res.json(err);
            });
        });
    });

    app.delete("/api/posts/:id", function(req, res) {
        var postid = req.params.id;

        db.Comment.destroy({
            where: {
                PostId: postid
            }
        }).then(function(delCnt) {
            db.Post.destroy({
                where: {
                    id: postid
                }
            }).then(function(delCnt) {
                res.json(delCnt);
            }).catch(function(err) {
                res.json(err);
            });
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.delete("/api/comments/:id", function(req, res) {
        var commentid = req.params.id;

        db.Comment.destroy({
            where: {
                id: commentid
            }
        }).then(function(delCnt) {
            res.json(delCnt);
        }).catch(function(err) {
            res.json(err);
        });
    });

    // NEW - adding passport routing
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
      // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
      // So we're sending the user back the route to the members page because the redirect will happen on the front end
      // They won't get this or even be able to access this page if they aren't authed
      res.json("/members");
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function(req, res) {
      console.log(req.body);
      db.User.create({
        email: req.body.email,
        password: req.body.password
      }).then(function() {
        res.redirect(307, "/api/login");
      }).catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
    });

    // Route for logging user out
    app.get("/logout", function(req, res) {
      req.logout();
      res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function(req, res) {
      if (!req.user) {
        // The user is not logged in, send back an empty object
        res.json({});
      }
      else {
        // Otherwise send back the user's email and id
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
          email: req.user.email,
          id: req.user.id
        });
      }
  });


















};
