$(document).ready(function() {

    var url = window.location.search;
    var userId = 0;

    if (url.indexOf("?user_id=") !== -1) {
        userId = url.split("=")[1];
    }

    $("#file-input").on("change", function() {
        const file = $('#file-input').get()[0].files[0];
        if(file == null){
            return alert('No file selected.');
        }
        getSignedRequest(file);
    });

    function getSignedRequest(file){
        $.ajax({
            url: `/sign-s3?file-name=${file.name}&file-type=${file.type}`,
            method: "GET",
        }).done(function(res) {
            $("#post-file").val(res.url);
            uploadFile(file, res.signedRequest, res.url);
        });
    }

    function uploadFile(file, signedRequest, url){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    var type = file.type.split('/');
                    switch(type[0]) {
                        case "image":
                            var img = $("<img>");
                            img.attr("src", url);
                            img.attr("style", "max-width: 500px");
                            $("#fileview").append(img);
                            break;
                        case "audio":
                            var audio = $("<audio controls>");
                            var source = $("<source>");
                            source.attr("src", url);
                            // source.attr("type", file.type);
                            audio.append(source);
                            $("#fileview").append(audio);
                            break;
                        case "video":
                            var video = $("<video controls>");
                            video.attr("style", "max-width: 500px");
                            var source = $("<source>");
                            source.attr("src", url);
                            // source.attr("type", file.type);
                            video.append(source);
                            $("#fileview").append(video);
                            break;
                    }
                }
                else{
                    alert('Could not upload file.');
                }
            }
        };
        xhr.send(file);
    }

    $("#submit-post-button").on("click", function() {
        var postData = {
            body: $("#post-body").val().trim(),
            category: $("#post-category").val().trim(),
            file_location: $("#post-file").val().trim(),
            UserId: userId
        }

        if (!postData.body || (postData.UserId === 0)) {
            return;
        }

        $.post("/api/posts", postData).then(function(data) {
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
