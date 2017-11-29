$(document).ready(function() {

    var userId;
    var postId;

    $("#go-chat").on("click", function(){
	    if (window.showModelessDialog) {        // Internet Explorer
	        showModelessDialog ("/new_chat.html", window, "dialogWidth:500px; dialogHeight:800px");
	    }
	    else {
	        window.open ("/new_chat.html", "","width=500, height=800px, alwaysRaised=yes");
	    }
    });

    var socket = io();
    socket.on('timer message', function(msg){
    	console.log(msg);
    	location.reload();
    });

});

document.getElementById("login").onclick = function () {
    // location.href = "log_in.html";
    location.href = "/posts?user_id=30";
};

