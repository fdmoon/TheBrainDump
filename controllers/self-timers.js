// *********************************************************************************
// self-timers.js - this file offers a set of timers inside server
// *********************************************************************************

// Dependencies
// =============================================================

var moment = require("moment");
var fs = require("fs");
var path = require("path");

// Requiring our models
var db = require("../models");

var logFile = path.join(__dirname, "./self-timer.log");

var timePeriod = 60 * 1000;
var enoughLikes = 10;
var enoughDislikes = 10;

// Timers
// =============================================================
module.exports = function(io) {
	fs.writeFile(logFile, "", function (err) {
		if(err)	throw err;
	});

	var timerId = setInterval(function() {
		db.Post.findAll({}).then(function(dbPost) {
            // console.log(JSON.stringify(dbPost, null, 4));

            for(var i=0; i<dbPost.length; i++) {
            	// Check if post gets timeout
            	checkTimeout(dbPost[i]);

				// Check if post obtains enough likes
				checkEnoughLikes(dbPost[i]);

				// Check if post obtains enough dislikes
				checkEnoughDislikes(dbPost[i]);
            }
        });

        // console.log(moment().format());

	}, timePeriod);	// cf. clearInterval(timerId);

	function checkTimeout(post) {
    	var diffTime = moment().diff(moment(post.updatedAt), "hours");

    	// console.log(moment(post.updatedAt).format());
    	// console.log(diffTime);

    	if(diffTime > post.timeout) {
			// Delete the post
			deletePost(post, "DELETE (End-of-life)");
    	}
	}

	function checkEnoughLikes(post) {
		if((!post.extended) && ((post.like_count - post.dislike_count) >= enoughLikes)) {
	        db.Post.update(
	            {
	                timeout: db.Sequelize.literal('timeout + 24'),
	                extended: true
	            },
	            {
	                where: {
	                    id: post.id
	                }
	            }
	        ).then(function(dbPost) {
	            logToFile("UPDATE (Enough-Likes)", JSON.stringify(post, null, 4), "Success");
	            io.emit('timer message', "UPDATE (Enough-Likes)");
	        }).catch(function(err) {
	            logToFile("UPDATE (Enough-Likes)", JSON.stringify(post, null, 4), "Failure");
	        });
		}
	}

	function checkEnoughDislikes(post) {
		if((post.dislike_count - post.like_count) >= enoughDislikes) {
			// Delete the post
			deletePost(post, "DELETE (Enough-dislikes)");
		}
	}

	function deletePost(post, title) {
        db.Comment.destroy({
            where: {
                PostId: post.id
            }
        }).then(function(delCnt) {
            db.Post.destroy({
                where: {
                    id: post.id
                }
            }).then(function(delCnt) {
            	logToFile(title, JSON.stringify(post, null, 4), "Success");
            	io.emit('timer message', title);
            }).catch(function(err) {
            	logToFile(title, JSON.stringify(post, null, 4), "Failure to delete this");
            });
        }).catch(function(err) {
            logToFile(title, JSON.stringify(post, null, 4), "Failure to delete comments");
        });		
	}

	function logToFile(title, body, result) {
    	var logString = "[" + moment().format() + "] ";
    	logString += title + "\n";
    	logString += body + "\n";
    	logString += "=> " + result + "\n";

		fs.appendFile(logFile, logString, function (err) {
			if(err)	throw err;
		});
	}	
};

