$(document).ready(function() {

    var url = window.location.search;
    var postId = 0;

    if (url.indexOf("?post_id=") !== -1) {
        postId = url.split("=")[1];
    }

    $("#submit-comment-button").on("click", function() {
        var commentData = {
            text: $("#comment-text").val().trim(),
            PostId: postId
        }

        if (!commentData.text || (commentData.PostId === 0)) {
            return;
        }

        $.post("/api/comments", commentData).then(function(data) {
            window.location.replace(data);
            // If there's an error, handle it by throwing up a boostrap alert
        }).catch(function(err) {
            console.log(err.responseJSON);
        });
    });

    $("#go-main").on("click", function() {
        location.href = "/main";
    });

});

