import { database, ref, set } from "./shared/config.js";
import {
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

const wishlistTable = document.getElementById("wishlistTable");

// Function to fetch and display the wishlist in real time
const fetchWishlist = () => {
  const wishlistRef = ref(database, "wishlist/");
  onValue(wishlistRef, (snapshot) => {
    wishlistTable.innerHTML = ""; // Clear the table
    const wishlist = snapshot.val();
    if (wishlist) {
      Object.keys(wishlist).forEach((key) => {
        const item = wishlist[key];
        const stockStatus = item.stock; // Ensure accurate stock status
        const row = `
          <tr>
            <td style="display: flex; align-items: center;">
              <img src="${item.image}" alt="${
          item.title
        }" style="width: 50px; height: 50px; margin-right: 10px;">
              ${item.title}
            </td>
            <td>${item.price}</td>
            <td>
              <span class="stock-status ${
                stockStatus ? "available" : "unavailable"
              }">
                ${stockStatus ? "In Stock" : "Out of Stock"}
              </span>
            </td>
            <td>
              <button  
                class="add-to-cart-btn ${stockStatus ? "active" : "disabled"}"
                ${stockStatus ? "" : "disabled"}
                onclick="window.addToCart('${key}')"
              >
              <a href="../html/checkout.html?cardId=productid14">
                Buy Now
                
              </button>
            </td>
            <td>
              <button class="remove-btn" onclick="window.removeItem('${key}')">
                Remove
              </button>
            </td>
          </tr>
        `;
        wishlistTable.insertAdjacentHTML("beforeend", row);
      });
    } else {
      wishlistTable.innerHTML =
        "<tr><td colspan='5'>Your wishlist is empty!</td></tr>";
    }
  });
};

// Function to add an item to the wishlist
const addItem = (id, title, price, stock, image) => {
  const wishlistRef = ref(database, `wishlist/${id}`);
  set(wishlistRef, { id, title, price, stock, image });
};

// Function to remove an item from the wishlist
const removeItem = (id) => {
  const itemRef = ref(database, `wishlist/${id}`);
  remove(itemRef)
    .then(() => {
      alert(`Item with ID ${id} removed successfully!`);
    })
    .catch((error) => {
      console.error(`Error removing item with ID ${id}:`, error);
      alert("Failed to remove the item. Please try again.");
    });
};

// Function to handle adding items to the cart
const addToCart = (id) => {
  alert(`Item with ID ${id} added to cart!`);
};

// Expose functions to the global scope
window.removeItem = removeItem;
window.addToCart = addToCart;

// Fetch wishlist on page load
fetchWishlist();
