// //when user clicks submit button
// $("#submit-post-button").on("click", function(event) {
//   event.preventDefault();
//
//   var postBody = $("#file-input").val().trim();
//
//   $.get("/api/posts/", function(data) {
//
// //make newPost object
//     var newPost = {
//       body: postBody,
//       category: $("category-type").val(),
//       createdAt: Date.now()
//     };
//
//     $.post("/api/posts", newPost).done(function(data) {
//       console.log(data);
//     });
//   });
// })
