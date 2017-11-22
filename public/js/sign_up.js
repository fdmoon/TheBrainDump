$(document).ready(function() {

  $("#submit").on("click", function() {
    var userData = {
      username: $("#usernameInput").val().trim(),
      password: $("#passwordInput").val().trim()
    };

    if (!userData.username || !userData.password) {
      return;
    }

    $.post("/api/signup", userData).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a boostrap alert
    }).catch(function(err) {
      console.log(err.responseJSON);
      // $("#alert .msg").text(err.responseJSON);
      // $("#alert").fadeIn(500);
    });

    $("#usernameInput").val("");
    $("#passwordInput").val("");    

  });

});

