(function () {
  var TOKEN_KEY = "userToken";

  function getLatestToken() {
    try {
      var token = window.sessionStorage.getItem(TOKEN_KEY);
      return Promise.resolve({ success: true, data: token });
    } catch (e) {
      return Promise.resolve({ success: false, error: "Error at getLatestToken!" });
    }
  }

  function updateUserProfile(token, updatedData) {
    return Promise.resolve().then(function () {
      console.log("Mock update:", updatedData);
      return true;
    }).catch(function (err) {
      console.error("Error updating profile:", err);
      return false;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("profile-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var updatedData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        userName: document.getElementById("userName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
      };

      getLatestToken().then(function (tokenResponse) {
        if (tokenResponse.success && tokenResponse.data) {
          return updateUserProfile(tokenResponse.data, updatedData).then(function (result) {
            alert(result ? "Profile updated successfully!" : "Failed to update profile.");
          });
        } else {
          alert("Token missing.");
        }
      });
    });
  });
})();
