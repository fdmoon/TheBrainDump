document.getElementById("login").onclick = function () {
    location.href = "log_in.html";
};

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
