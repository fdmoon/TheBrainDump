$(document).ready(function() {
  var usernameInput = $("input#username-input");
  var passwordInput = $("input#password-input");

  // Submit button is pressed
  $("#submit").on("click", function() {
    usernameInput.removeClass("is-danger");
    passwordInput.removeClass("is-danger");
    $("#note-u").empty();
    $("#note-p").empty();
        
    var userData = {
      username: usernameInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.username || !userData.password) {
      return;
    }

    // If we have an  and password we run the loginUser function and clear the form
    loginUser(userData.username, userData.password);

    usernameInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(username, password) {
    $.post("/api/login", {
      username: username,
      password: password
    }).then(function(data) {
      console.log(data);
      window.location.replace(data);
      // If there's an error, log the error
    }).catch(function(err) {
      if(err.responseJSON[0].indexOf("username") !== -1) {
        usernameInput.addClass("is-danger");
        $("#note-u").text(err.responseJSON[0]);
      }
      else if(err.responseJSON[0].indexOf("password") !== -1) {
        passwordInput.addClass("is-danger");
        $("#note-p").text(err.responseJSON[0]);
      }
    });
  }

  // Cancel button is pressed
  document.getElementById("cancelme").onclick = function () {
      location.reload();
  };
});

