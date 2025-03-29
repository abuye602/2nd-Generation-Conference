// Function to show notification
function showNotification(type) {
  const element = document.getElementById(type + "-message");
  element.style.display = "block";

  // Hide notification after 3 seconds
  setTimeout(() => {
    element.style.display = "none";

    // Refresh page after success notification disappears
    if (type === "success") {
      window.location.reload();
    }
    window.scrollTo(0, 0);
  }, 900);
}

// Optionally, prevent numbers in the name field
document.getElementById("name").addEventListener("input", function () {
  this.value = this.value.replace(/[0-9]/g, "");
});

// Handle form submission with JavaScript (using fetch)
document
  .getElementById("event-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Show loading spinner
    document.getElementById("loading-spinner").style.display = "flex";

    // Gather form data into an object
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      ministry: document.getElementById("ministry").value.trim(),
      age: document.getElementById("age").value,
      attendees: document.getElementById("attendees").value,
      timestamp: new Date().toLocaleString(),
    };

    // Build URL-encoded data
    const urlParams = new URLSearchParams();
    urlParams.append("name", formData.name);
    urlParams.append("email", formData.email);
    urlParams.append("ministry", formData.ministry);
    urlParams.append("age", formData.age);
    urlParams.append("attendees", formData.attendees);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxqMK7QyKh1ph5gW6t6im2eCVKiCxy9k5KCKOK6iG5LPZd_6s7-8eV_gHUzUfvqPcHf4A/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: urlParams,
        }
      );

      const text = await response.text();
      console.log("Raw response:", text); // Log the raw response for debugging

      let result;
      try {
        result = JSON.parse(text);
        console.log("Parsed result:", result); // Log the parsed result
      } catch (e) {
        console.error("Failed to parse JSON:", text);
        document.getElementById("error-message").textContent =
          "Server response error. Please try again or contact support.";
        document.getElementById("loading-spinner").style.display = "none";
        showNotification("error");
        return;
      }

      // Hide loading spinner
      document.getElementById("loading-spinner").style.display = "none";

      if (result.status === "duplicate") {
        document.getElementById("error-message").textContent =
          "You have already registered with this email address.";
        showNotification("error");
      } else if (result.status === "success") {
        // Show success notification
        showNotification("success");
        document.getElementById("event-form").reset();
      } else {
        document.getElementById("error-message").textContent =
          result.message || "Submission failed. Please try again.";
        showNotification("error");
      }
    } catch (error) {
      // Hide loading spinner even if there's an error
      document.getElementById("loading-spinner").style.display = "none";

      // Show error notification with more details
      console.error("Submission error:", error);
      document.getElementById("error-message").textContent =
        "Connection error. Please check your internet and try again.";
      showNotification("error");
    }
  });
