$(document).ready(function() {

  $("#submit").on("click", function() {
    var userData = {
      username: $("#usernameInput").val().trim(),
      password: $("#passwordInput").val().trim(),
      terms:    $('input[type=checkbox]').prop('checked')
    };

    if (!userData.terms) {
      alert("Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy");
      return;
    } else if (!userData.username || !userData.password) {
      return;
    }

    $.post("/api/signup", userData).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a boostrap alert
    }).catch(function(err) {
      console.log(err.responseJSON);
      // alert(err.responseJSON.errors[0].message);
      if (err.responseJSON.errors[0].message === "username must be unique") {
        $("#usernameInput").addClass("is-danger");
        $("#note").text(err.responseJSON.errors[0].message);
      }
      // $("#alert .msg").text(err.responseJSON);
      // $("#alert").fadeIn(500);
    });

    $("#usernameInput").val("");
    $("#passwordInput").val("");

  });

});

// Cancel button is pressed
document.getElementById("cancelme").onclick = function () {
    location.href = "main.html";
};
