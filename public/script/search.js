let map = null;
// search.js
document.addEventListener("DOMContentLoaded", function () {
  var searchForm = document.getElementById("searchForm");
  var activitiesTable = document.getElementById("activitiesTable");
  var activitiesBody = document.getElementById("activitiesBody");
  var errorContainer = document.getElementById("error");
  var mapContainer = document.getElementById("mapContainer");
  var activitiesHeading = document.getElementById("activitiesHeading");

  searchForm.addEventListener("submit", function (event) {
    handleSubmit(event);
  });

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    var region = document.getElementById("region").value;
    if (region == "") {
      errorContainer.innerHTML = `<p class="error">Search Field is Empty.</p>`;
      activitiesBody.innerHTML = "";
      mapContainer.style.display = "none";
      return;
    } else {
      errorContainer.innerHTML = ``;
    }
    activitiesHeading.innerHTML = `<h4> Activities in the Region: ${region}</h4>`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/region/activities?region=" + region, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var activities = JSON.parse(xhr.responseText);
        displayActivities(activities);
        displayMap(activities);
      }
    };
    xhr.send();
  }

  function displayActivities(activities) {
    if (activities.length === 0) {
      errorContainer.innerHTML = "<p>No records found.</p>";
    }

    activitiesBody.innerHTML = "";

    activities.forEach(function (activity) {
      if (activity.error) {
        errorContainer.innerHTML = `<p class="error">${data.error}</p>`;
      }
      // Truncate the exp_description to the first 25 characters
      const truncatedDescription =
        activity.exp_description.length > 25
          ? `${activity.exp_description.substring(0, 25)}...`
          : activity.exp_description;

      var row = activitiesBody.insertRow();
      row.innerHTML = `
        <td>${activity.id}</td>
        <td>${activity.exp_name}</td>
        <td>${activity.exp_type}</td>
        <td>${activity.country}</td>
        <td>${activity.region}</td>
        <td>${truncatedDescription}</td>
        <td>${activity.bookings}</td>
        <td><button class="book-button" data-id="${activity.id}">Book</button></td>

      `;
    });
    attachBookHandlers();
  }

  function attachBookHandlers() {
    var bookButtons = document.querySelectorAll(".book-button");
    bookButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var experienceId = this.getAttribute("data-id");
        bookExperience(experienceId);
      });
    });
  }

  function displayMap(activities) {
    if (activities.length === 0) {
      mapContainer.style.display = "none"; // Hide map container
      return;
    }

    if (map) {
      map.remove();
    }

    mapContainer.style.display = "block"; // Show map container

    // Initialize the map and set the view to the first activity's coordinates
    map = L.map("map").setView([activities[0].lat, activities[0].lon], 12);

    const myIcon = L.icon({
      iconUrl: "/images/marker-icon.png",
    });

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // Add markers for each activity
    activities.forEach(function (activity) {
      var marker = L.marker([activity.lat, activity.lon], {
        icon: myIcon,
      }).addTo(map);
      var popupContent = `<b>${activity.exp_name}</b><br>${activity.exp_description}`;

      if (document.querySelector(".login-user-info")) {
        // Display additional input fields for logged-in users
        var numberOfPeopleField = `<div>
            <label for="numOfPeople">Number of People:</label>
            <input type="number" id="numOfPeople" placeholder="Number of People" min="1" value="1" />
        </div>`;
        var submitButton = `<button class="booking-button" user-booking-id="${activity.id}">Book</button>`;

        popupContent += numberOfPeopleField + submitButton;
      }

      marker.bindPopup(popupContent);
    });

    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("booking-button")) {
        var experienceId = event.target.getAttribute("user-booking-id");
        var numOfPeople = 1; // Default value

        if (document.querySelector("#numOfPeople")) {
          numOfPeople = parseInt(
            document.querySelector("#numOfPeople").value,
            10
          );
        }

        reserveExperience(experienceId, numOfPeople);
      }
    });

    if (document.querySelector(".login-user-info")) {
      map.on("click", function (e) {
        openAddExperienceForm(e.latlng, map);
      });
    } else {
      map.on("click", function () {
        CustomAlert("Please login first.", "error");
      });
    }
  }

  function reserveExperience(experienceId, numOfPeople) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/reserve/experience`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (xhr.status === 500) {
        CustomAlert(response.error, "error");
      } else if (xhr.status === 200) {
        CustomAlert(response.success, "success");
        handleSubmit();
      } else {
        CustomAlert(response.error, "error");
      }
    };

    var requestData = {
      expId: experienceId,
      people: numOfPeople,
    };

    xhr.send(JSON.stringify(requestData));
  }

  function openAddExperienceForm(coords, map) {
    const formHTML = `
    <div class="popup-form" style="max-height: 80vh; overflow-y: auto;">
      <h3>Add New Experience</h3>
      <form id="addExperienceForm">
        <div class="input-row">
          <input type="text" placeholder="Experience Name" id="exp_name" name="exp_name" />
        </div>
        <div class="input-row">
          <input type="text" placeholder="Experience Type" id="exp_type" name="exp_type" />
        </div>
        <div class="input-row">
          <input type="text" placeholder="Country" id="country" name="country" />
        </div>
        <div class="input-row">
          <input type="text" placeholder="Region" id="region" name="region" />
        </div>
        <div class="input-row">
          <input type="number" placeholder="Latitude" id="lat" step="0.01" name="lat" value=${coords.lat} />
        </div>
        <div class="input-row">
          <input type="number" placeholder="Longitude" id="lon" step="0.01" name="lon" value=${coords.lng} />
        </div>
        <div class="input-row">
          <input type="number" placeholder="No. of Bookings" id="bookings" name="bookings" />
        </div>
        <div class="input-row">
          <textarea placeholder="Description" id="exp_description" name="exp_description"></textarea>
        </div>

        <button type="submit">Add Experience</button>
      </form>
    </div>
  `;

    const popup = L.popup().setLatLng(coords).setContent(formHTML).openOn(map);

    const addExperienceForm = popup
      .getElement()
      .querySelector("#addExperienceForm");
    addExperienceForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(addExperienceForm);
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      addExperience(formDataObject, popup);
    });
  }

  function addExperience(experienceData, popup) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/new/experience", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        CustomAlert("Experience added successfully!", "success");
        popup.remove();
        handleSubmit();
      } else if (xhr.status === 400) {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          CustomAlert(response.error);
        }
      } else {
        displayCustomAlert("Error adding experience.", "error");
      }
    };
    xhr.send(JSON.stringify(experienceData));
  }

  function bookExperience(experienceId) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", `/book/experience?id=` + experienceId, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (xhr.status === 500) {
        CustomAlert(response.error, "error");
      } else if (xhr.status === 200) {
        CustomAlert(response.success, "success");
        handleSubmit();
      } else {
        CustomAlert("Error booking experience.", "error");
      }
    };
    xhr.send();
  }
});

function toggleMenu() {
  var menuRight = document.querySelector(".menu-right");
  if (menuRight.classList.contains("responsive")) {
    menuRight.classList.remove("responsive");
  } else {
    menuRight.classList.add("responsive");
  }
}

function CustomAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `custom-alert ${type}`;
  alertDiv.innerText = message;
  document.body.appendChild(alertDiv);

  setTimeout(function () {
    alertDiv.remove();
  }, 1000);
}
