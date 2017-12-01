document.getElementById("login").onclick = function () {
    location.href = "log_in.html";
};



// $.get("/api/posts/", function(data) {
//   console.log(data);
//   renderPosts(data);
// });
//
//
// function renderPosts(data) {
//   if(data.length !== 0){
//     $("#postHere").show();
//
//     for(var i = 0; i <data.length; i++) {
//       var div = $("<div>");
//
//       div.append("<h2>" + data[i].title + "</h2>");
//       div.append("<p> body: " + data[i].body + "</p>");
//       div.append("<p> category: " + data[i].category + "</p>");
//       div.append("<p> file_location: " + data[i].file_location + "</p>");
//       div.append("<p> timeout: " + data[i].timeout + "</p>");
//       div.append("<p> shared: " + data[i].shared + "</p>");
//       div.append("<p> like count: " + data[i].like_count + "</p>");
//       div.append("<p> dislike count: " + data[i].dislike_count + "</p>");              div.append("<p> extended: " + data[i].extended + "</p>");
//
//         $("#postHere").append(div);
//     }

$("#like").on("click", function() {
  $.post("/api/posts", function(data) {
    like_count: like_count++,
  },
  {
    where: {
        id: req.params.id
    }
  });

});
