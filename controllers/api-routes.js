// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
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
    app.post("/api/users", function(req, res) {
        db.User.create(req.body).then(function(err, dbUser) {
            res.json(dbUser);
        }).catch(function(err) {
            res.json(err);
        });
    });

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
};

