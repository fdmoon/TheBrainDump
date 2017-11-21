// *********************************************************************************
// self-timers.js - this file offers a set of timers inside server
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var moment = require("moment");
var db = require("../models");

// Timers
// =============================================================
module.exports = function() {
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

		console.log(moment().format());

	}, 10000);	// cf. clearInterval(timerId);

	function checkTimeout(post) {
    	var diffTime = moment().diff(moment(post.updatedAt), "hours");

    	// console.log(moment(post.updatedAt).format());
    	// console.log(diffTime);

    	if(diffTime > post.timeout) {
			// console.log("Timeout!");
			// Delete the post
    	}
    	else 
    	{
    		// console.log("Timeout left:" + (post.timeout - diffTime))
    	}		
	}

	function checkEnoughLikes(post) {

	}

	function checkEnoughDislikes(post) {

	}
};

