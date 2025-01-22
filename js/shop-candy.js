import { database, ref } from './shared/config.js'
import { onValue, } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";


// Listen for data changes
onValue(ref(database, "products/"), (snapshot) => {
  const data = snapshot.val();
  const filterCategory = "Candy bouquets";
  const filteredProducts = Object.values(data).filter(product => product.category === filterCategory);
  displayProducts(filteredProducts);
});

// Function to display products
function displayProducts(filteredProducts) {
  let formattedData = "";
  if (!filteredProducts) {
    formattedData = "<p>No data available.</p>";
  } else {
    for (const productId in filteredProducts) {
        const product = filteredProducts[productId];
          formattedData += `
            <div class="col-sm-6 col-md-4 col-lg-3">
              <div class="box">
                <a href="" class="text-decoration-none">
                  <div class="img-box">
                    <img src="${product.image}" alt="">
                  </div>
                  <hr>
                  <div class="detail-box">
                    <h6 class="title">
                      ${product.title}
                    </h6>
                    <h6>
                      <span>
                        ${product.price}
                      </span>
                    </h6>
                  </div>
                  <div class="position-absolute d-flex align-items-center justify-content-center" 
                    style="top: 0.5rem; left: 0.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease-in-out;">
                    <i class="fas fa-heart text-danger" style="font-size: 1.2rem; transition: transform 0.3s ease-in-out;"></i>
                  </div>
                  <div class="description">
                    <p class="title" style="font-family: 'Space Grotesk', sans-serif;">${product.description}</p>
                  </div>
                  <button class="container-fluid buy-now">BUY NOW</button>
                </a>
              </div>
            </div>
          `;
    }
  }
  document.getElementById("product-container").innerHTML = formattedData;
}



