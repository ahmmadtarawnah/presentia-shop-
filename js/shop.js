import { database, ref } from "./shared/config.js";
import { onValue } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Listen for data changes
const starCountRef = ref(database, "products/");
let firebaseData = {}; // Store fetched data globally for filtering
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  firebaseData = data; // Save data globally
  displayProducts(data);
});

// Function to display products
function displayProducts(data, filterCategory = "all", searchQuery = "") {
  let formattedData = "";

  if (!data) {
    formattedData = "<p>No data available.</p>";
  } else {
    for (const productId in data) {
      if (data.hasOwnProperty(productId)) {
        const product = data[productId];

        // Check category and search filters
        const matchesCategory =
          filterCategory === "all" ||
          (filterCategory === "option-1" &&
            product.category === "flowerBouquets") ||
          (filterCategory === "option-2" &&
            product.category === "Chocolate bouquets") ||
          (filterCategory === "option-3" &&
            product.category === "Candy bouquets");

        const matchesSearch =
          searchQuery === "" ||
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
          ;

        if (matchesCategory && matchesSearch) {
          formattedData += `
            <div class="col-sm-6 col-md-4 col-lg-3">
              <a href="product-details.html?cardId=${productId}" class="text-decoration-none">
                <div class="box">
                  <div class="img-box">
                    <img src="${product.image}" alt="">
                  </div>
                  <hr>
                  <div class="detail-box">
                    <h6 class="title">${product.title}</h6>
                    <h6><span>${product.price}</span></h6>
                  </div>
                  <div class="description">
                    <p class="title">${product.description}</p>
                  </div></a>
                  <a href="checkout.html?cardId=${productId}" class="text-decoration-none">
                    <button class="container-fluid buy-now">BUY NOW</button>
                  </a>
                </div>
            </div>
          `;
        }
      }
    }
  }

  document.getElementById("product-container").innerHTML = formattedData;
}

// Listen for dropdown changes
document.querySelectorAll('.options input[type="radio"]').forEach((input) => {
  input.addEventListener("change", (event) => {
    const selectedCategory = event.target.id;

    // Fetch and filter products based on the selected category
    displayProducts(firebaseData, selectedCategory, searchBar.value);
  });
});

// Listen for search bar input
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", () => {
  const searchQuery = searchBar.value;

  // Filter products based on search query
  const selectedCategory =
    document.querySelector('.options input[type="radio"]:checked')?.id || "all";
  displayProducts(firebaseData, selectedCategory, searchQuery);
});
