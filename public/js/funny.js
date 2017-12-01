$(document).ready(function() {

  $("#all-category").on("click", function() {
    location.href = "/main";
  });

  $("#funny").on("click", function() {
    location.href = "/funny";
  });

  $("#random-category").on("click", function() {
    location.href = "/random";
  });

  $("#gaming-category").on("click", function() {
    location.href = "/gaming";
  });

  $("#life-category").on("click", function() {
    location.href = "/life";
  });

    $("#the-brain go-chat").on("click", function() {
	    if (window.showModelessDialog) {        // Internet Explorer
	        showModelessDialog ("/new_chat.html", window, "dialogWidth:500px; dialogHeight:800px");
	    }
	    else {
	        window.open ("/new_chat.html", "","width=500, height=800px, alwaysRaised=yes");
	    }
    });

    $(".thumbs-up").on("click", function() {
        var postid = $(this).attr("data-id");

        $.ajax({
            url: "/api/posts/like/" + postid,
            method: "PUT"
        }).done(function(data) {
            var count = parseInt($("#like_" + postid).text());
            count += data[0];
            $("#like_" + postid).text(count);

        // If there's an error, handle it by throwing up a boostrap alert
        }).catch(function(err) {
            console.log(err.responseJSON);
        });
    });

    $(".thumbs-down").on("click", function() {
        var postid = $(this).attr("data-id");

        $.ajax({
            url: "/api/posts/dislike/" + postid,
            method: "PUT"
        }).done(function(data) {
            var count = parseInt($("#dislike_" + postid).text());
            count += data[0];
            $("#dislike_" + postid).text(count);

        // If there's an error, handle it by throwing up a boostrap alert
        }).catch(function(err) {
            console.log(err.responseJSON);
        });
    });

    var socket = io();
    socket.on('timer message', function(msg){
    	console.log(msg);
    	location.reload();
    });

    $(".post-file").each(function(){
        var url = $(this).attr("src");
        var postid = $(this).attr("data-id");

        if(url) {
            var arr = url.split(".");

            console.log(arr);

            switch(arr[arr.length-1]) {
                case "mp3":
                    var audio = $("<audio controls>");
                    audio.attr("style", "max-width: 250px");
                    var source = $("<source>");
                    source.attr("src", url);
                    // source.attr("type", file.type);
                    audio.append(source);
                    $("#fileview_" + postid).empty();
                    $("#fileview_" + postid).append(audio);
                    break;
                case "mp4":
                    var video = $("<video controls>");
                    video.attr("style", "max-width: 250px");
                    var source = $("<source>");
                    source.attr("src", url);
                    // source.attr("type", file.type);
                    video.append(source);
                    $("#fileview_" + postid).empty();
                    $("#fileview_" + postid).append(video);
                    break;
            }
        }
    });

});
