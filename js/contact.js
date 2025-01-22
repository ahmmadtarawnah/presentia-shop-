import { database, ref, set } from "./shared/config.js";

// Function to submit the contact form data to Firebase
function submitContactForm(firstname, lastname, email, phone, message) {
  set(ref(database, "contact/"), {
    firstname: firstname,
    lastname: lastname,
    email: email,
    phone: phone,
    message: message,
    timestamp: new Date().toISOString(),
  })
    .then(() => {
      alert("Data saved successfully!");
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}

// Event listener to handle form submission
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevents the default form submission behavior

  // Retrieve form values
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  // Validation for required fields
  if (!firstname || !lastname || !email || !phone || !message) {
    alert("All fields are required. Please fill out the form completely.");
    return;
  }

  // Call the function to submit the form data to Firebase
  submitContactForm(firstname, lastname, email, phone, message);
});