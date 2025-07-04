window.addEventListener("DOMContentLoaded", () => {
  const paymentSelect = document.getElementById("paymentOption");
  const submitButton = document.querySelector(".submit-btn"); // Make sure your button has class="submit-btn"

  // Get IP from ipinfo.io
  fetch("https://ipinfo.io/json?token=103ea754f21c36") // Optional: register for free token at ipinfo.io
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("ip").value = data.ip || "Unknown";
    })
    .catch(() => {
      document.getElementById("ip").value = "Unknown";
    });

  // Set userAgent
  const ua = navigator.userAgent;
  let summary = "";

  // Browser & Platform Detection
  if (/iPhone|iPad|iPod/i.test(ua)) {
    summary = "Safari on iOS";
  } else if (/Android/i.test(ua)) {
    if (/Chrome/i.test(ua)) {
      summary = "Chrome on Android";
    } else {
      summary = "Browser on Android";
    }
  } else if (/Macintosh/i.test(ua)) {
    if (/Chrome/i.test(ua)) {
      summary = "Chrome on macOS";
    } else if (/Safari/i.test(ua)) {
      summary = "Safari on macOS";
    } else if (/Firefox/i.test(ua)) {
      summary = "Firefox on macOS";
    } else {
      summary = "Browser on macOS";
    }
  } else if (/Windows/i.test(ua)) {
    if (/Chrome/i.test(ua)) {
      summary = "Chrome on Windows";
    } else if (/Edge/i.test(ua)) {
      summary = "Edge on Windows";
    } else if (/Firefox/i.test(ua)) {
      summary = "Firefox on Windows";
    } else {
      summary = "Browser on Windows";
    }
  } else {
    summary = "Unknown browser/device";
  }

  document.getElementById("userAgent").value = summary;

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
        ip: document.getElementById("ip").value,
        userAgent: document.getElementById("userAgent").value,
        company: document.getElementById("company").value.trim(),
        timestamp: new Date().toLocaleString(),
      };

      const urlPayload = new URLSearchParams();
      for (const key in formData) {
        urlPayload.append(key, formData[key]);
      }

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbycq1ZrOOMCKjr2U7_uNVYhSCxpOwgIcdGrfj9UxCY0S6AYRctCbM5fVfKzCusgYOGacQ/exec",
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
    }, 3000);
  }
  function showError(message) {
    const errorEl = document.getElementById("error-message");
    errorEl.textContent = message;
    showNotification("error");
  }
});
