document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("loginForm");
  var loginResult = document.getElementById("loginResult");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var usernameOrEmail = document.getElementById("usernameOrEmail").value;
    var password = document.getElementById("password").value;

    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `/login/user?usernameOrEmail=${usernameOrEmail}&password=${password}`,
      true
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.success) {
          createSessionAndRedirect(response.user);
        } else {
          CustomAlert(response.message, "error");
        }
      } else {
        var response = JSON.parse(xhr.responseText);
        CustomAlert(response.error, "error");
      }
    };
    xhr.send();
  });
});

function CustomAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `custom-alert ${type}`;
  alertDiv.innerText = message;
  document.body.appendChild(alertDiv);

  setTimeout(function () {
    alertDiv.remove();
  }, 1500);
}

function createSessionAndRedirect(userdetails) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login/create-session", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onload = function () {
    if (xhr.status === 200) {
      CustomAlertRedirect("Login successful!", "success");
    } else {
      CustomAlert("Error creating session.", "error");
    }
  };

  xhr.send(JSON.stringify(userdetails));
}

function CustomAlertRedirect(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `custom-alert ${type}`;
  alertDiv.innerText = message;
  document.body.appendChild(alertDiv);

  setTimeout(function () {
    alertDiv.remove();
    window.location.href = "/"; // Redirect to index page
  }, 1500);
}
