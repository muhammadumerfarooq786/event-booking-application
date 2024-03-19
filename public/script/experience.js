// add-experience.js
document.addEventListener("DOMContentLoaded", function () {
  var addExperienceForm = document.getElementById("addExperienceForm");

  addExperienceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var expData = {
      exp_name: document.getElementById("exp_name").value,
      exp_type: document.getElementById("exp_type").value,
      country: document.getElementById("country").value,
      region: document.getElementById("region").value,
      lat: document.getElementById("lat").value,
      lon: document.getElementById("lon").value,
      bookings: document.getElementById("bookings").value,
      exp_description: document.getElementById("exp_description").value,
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/new/experience", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
      if (xhr.status === 200) {
        CustomAlert("Experience added successfully!", "success");
        resetInputFields();
      } else if (xhr.status === 400) {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          CustomAlert(response.error);
        }
      } else {
        displayCustomAlert("Error adding experience.", "error");
      }
    };
    xhr.send(JSON.stringify(expData));
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

function resetInputFields() {
  document.getElementById("exp_name").value = "";
  document.getElementById("exp_type").value = "";
  document.getElementById("country").value = "";
  document.getElementById("region").value = "";
  document.getElementById("exp_description").value = "";
  document.getElementById("lat").value = "";
  document.getElementById("lon").value = "";
  document.getElementById("bookings").value = "";
}
