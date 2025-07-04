// Prevent numbers in the name field
document.getElementById("name").addEventListener("input", function () {
  this.value = this.value.replace(/[0-9]/g, "");
  if (this.value.trim() === "") {
    this.setCustomValidity("Please enter your full name");
  } else {
    this.setCustomValidity("");
  }
});

// Email validation
document.getElementById("email").addEventListener("blur", function () {
  const email = this.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    this.setCustomValidity("Please enter a valid email address");
    this.reportValidity();
  } else {
    this.setCustomValidity("");
  }
});

// Age validation
document.getElementById("age").addEventListener("input", function () {
  const age = parseInt(this.value);
  if (isNaN(age) || age < 1 || age > 88) {
    this.setCustomValidity("Age must be between 1 and 88");
  } else {
    this.setCustomValidity("");
  }
});

// Ministry validation - prevent submission with just spaces
// document.getElementById("ministry").addEventListener("blur", function () {
//   if (this.value.trim() === "") {
//     this.setCustomValidity("Please enter your ministry or church name");
//   } else {
//     this.setCustomValidity("");
//   }
// });
