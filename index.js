window.addEventListener("DOMContentLoaded", () => {
  const paymentSelect = document.getElementById("paymentOption");
  const submitButton = document.querySelector(".submit-btn"); // Make sure your button has class="submit-btn"

  paymentSelect.addEventListener("change", () => {
    const selected = paymentSelect.value;
    if (selected.includes("Paid")) {
      submitButton.textContent = "Pay Now";
    } else {
      submitButton.textContent = "Register Now";
    }
  });

  document
    .getElementById("event-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const paymentOption = paymentSelect.value;

      // Payment logic
      const urlParams = new URLSearchParams(window.location.search);
      const paymentConfirmed = urlParams.get("paid") === "true";

      if (paymentOption.includes("Paid") && !paymentConfirmed) {
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("error-message").textContent =
          "Please complete payment before submitting the form.";

        setTimeout(() => {
          window.open(
            "https://buy.stripe.com/test_9B6fZhgXo0x74T4f5UaR201",
            "_blank"
          );
        }, 1000);

        showNotification("error");
        return;
      }

      document.getElementById("loading-spinner").style.display = "flex";

      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        age: document.getElementById("age").value,
        accommodation: document.getElementById("accommodation").value.trim(),
        paymentOption: document.getElementById("paymentOption").value.trim(),
        timestamp: new Date().toLocaleString(),
      };

      const urlPayload = new URLSearchParams();
      for (const key in formData) {
        urlPayload.append(key, formData[key]);
      }

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzEN92r5_gzOzsdpuIrL2j3oPht2YtsYstYrOOxOYetn_2KJB4mFJn4_McRkZLm6ektqg/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlPayload,
          }
        );

        const text = await response.text();
        console.log("Raw response from server:", text);

        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          console.error("JSON parse failed:", e);
          showError("Server error: " + text);
          return;
        }

        document.getElementById("loading-spinner").style.display = "none";

        if (result.status === "duplicate") {
          showError("You've already registered with this email.");
        } else if (result.status === "success") {
          showNotification("success");
          document.getElementById("event-form").reset();
          submitButton.textContent = "Register Now";
        } else {
          showError(result.message || "Submission failed.");
        }
      } catch (err) {
        document.getElementById("loading-spinner").style.display = "none";
        showError("Connection error. Please try again.");
      }
    });

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
    }, 5000);
  }
  function showError(message) {
    const errorEl = document.getElementById("error-message");
    errorEl.textContent = message;
    showNotification("error");
  }
});
