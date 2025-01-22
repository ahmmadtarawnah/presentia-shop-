// heart waterfall//*************************************************************
const heartContainer = document.querySelector(".heart-container");

function createFallingHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");

  // Randomize the horizontal position
  heart.style.left = Math.random() * 100 + "vw";

  // Randomize the size and animation duration
  heart.style.width = heart.style.height = Math.random() * 20 + 10 + "px";
  heart.style.animationDuration = Math.random() * 2 + 3 + "s";

  heartContainer.appendChild(heart);

  // Remove the heart after it falls off the screen
  setTimeout(() => {
    heart.remove();
  }, 5000); //يحذف القلب من الصفحة بعد 5 ثوانٍ
}

// Start generating hearts and stop after 15 seconds
const heartInterval = setInterval(createFallingHeart, 20); //ينشئ قلب كل 20 ميللي ثانية
setTimeout(() => {
  clearInterval(heartInterval); // Stop generating hearts after 15 seconds
}, 2500); // تستمر بالسقوط لهذه المدة

// end heart waterfall//**********************************************************

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgc0tYF5WXG_kArW0h3YAnQ_BKjPXJZOw",
  authDomain: "presentia-55b8b.firebaseapp.com",
  databaseURL: "https://presentia-55b8b-default-rtdb.firebaseio.com",
  projectId: "presentia-55b8b",
  storageBucket: "presentia-55b8b.firebasestorage.app",
  messagingSenderId: "28781643269",
  appId: "1:28781643269:web:16fa963453ab31c9e43e6c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database };

// reviews
// Listen for data changes
const reviewsRef = ref(database, "reviews/productid");
onValue(reviewsRef, (snapshot) => {
  const data = snapshot.val();

  const reviewBoxes = document.querySelectorAll(".cardreviwe .card__details"); // Select all review boxes

  // Clear all review boxes
  reviewBoxes.forEach((box) => {
    box.innerHTML = ""; // Clear content of each review box
  });

  if (!data) {
    // If no reviews exist, show a message in the first box
    if (reviewBoxes[0]) {
      reviewBoxes[0].innerHTML =
        "<p>No reviews available yet. Be the first to review!</p>";
    }
  } else {
    // If reviews exist, distribute them across the boxes
    const reviewArray = Object.values(data); // Convert data to an array
    reviewArray.forEach((review, index) => {
      if (reviewBoxes[index]) {
        // Ensure the box exists for this review
        reviewBoxes[index].innerHTML = `
          <p>${review.comment}</p>
          <h4>${review.user}</h4>
        `;
      }
    });
  }
});

// ////////////////////////////////////////////////////////////////////////////////////////////////////////

// latest products

// Listen for data changes
const starCountRef = ref(database, "products/");
let firebaseData = {}; // Store fetched data globally for filtering
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  firebaseData = data; // Save data globally
  displayProducts(data);
});

// Function to display products
function displayProducts(data) {
  let formattedData = "";

  if (!data) {
    formattedData = "<p>No data available.</p>";
  } else {
    const productEntries = Object.entries(data); // Convert object to array of entries
    const limitedProducts = productEntries.slice(0, 8); // Limit to first 8 products

    for (const [productId, product] of limitedProducts) {
      formattedData += `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <a href="product-details.html?cardId=${productId}" class="text-decoration-none">
            <div class="box">
              <div class="img-box">
                <img src="${product.image}" alt="Product Image">
              </div>
              <hr>
              <div class="detail-box">
                <h6 class="title">${product.title}</h6>
                <h6><span>${product.price}</span></h6>
              </div>
              <div class="description">
                <p class="title">${product.description}</p>
              </div>
            </div>
          </a>
          <a href="checkout.html?cardId=${productId}" class="text-decoration-none">
            <button class="container-fluid buy-now">BUY NOW</button>
          </a>
        </div>
      `;
    }
  }
  // Display formatted data in the DOM
  document.getElementById("cards-containerz").innerHTML = formattedData;
}

// /////////////////////////////////////////////////////////////////////////////////////////

// upward arrow hidden in top
document.addEventListener("DOMContentLoaded", () => {
  const backToTopButton = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      // يظهر السهم عند تجاوز 200 بكسل من التمرير
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" }); // التمرير للأعلى بسلاسة
  });
});
/////////////////////////////////////////////////////////////////////

// whatsapp

// Opens sticky-chat automatically within 5 seconds of page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("offchat-menu").checked = true; // يبحث عن عنصر HTML يحتوي على المعرف
  }, 5000);
});
// /////////////////////////////////////////////

// Listen for data changes
const productRef = ref(database, "products/");
let productData = {}; // Store fetched data globally for displaying a product
onValue(productRef, (snapshot) => {
  const data = snapshot.val();
  productData = data; // Save data globally
  displayProduct(data);
});

// Function to display a single product
function displayProduct(data) {
  let htmlContent = "";

  if (!data) {
    htmlContent = "<p>No data available.</p>";
  } else {
    const productEntries = Object.entries(data); // Convert object to array of entries
    const limitedProduct = productEntries.slice(5, 6); // Limit to first product

    for (const [productId, product] of limitedProduct) {
      htmlContent += `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <a href="product-details.html?cardId=${productId}" class="text-decoration-none">
            <div class="box">
              <div class="imgnew">
                <img src="${product.image}" alt="Product Image">
              </div>
          
      `;
    }
  }
  // Display formatted data in the DOM
  document.getElementById("newarr").innerHTML = htmlContent;
}
