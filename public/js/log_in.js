$(document).ready(function() {
  var usernameInput = $("input#username-input");
  var passwordInput = $("input#password-input");

  // Submit button is pressed
  $("#submit").on("click", function() {
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
      window.location.replace(data);
      // If there's an error, log the error
    }).catch(function(err) {
      usernameInput.addClass("is-danger");
      passwordInput.addClass("is-danger");
      $("#note").text(err.responseText);
    });
  }

  // Cancel button is pressed
  document.getElementById("cancelme").onclick = function () {
      location.reload();
  };
});

