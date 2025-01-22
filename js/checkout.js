// checkout.js

// (1) Import Firebase dependencies
import { database } from "./shared/config.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// (2) Initialize variables to hold order data
let orderData = null;

// (3) Function to get Product Data from Firebase by productId
function getProductData(productId) {
    return get(ref(database, 'products/' + productId))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                alert('Product not found');
                return null;
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            return null;
        });
}

// (4) Function to display the product data on the checkout page
function displayProductData(product) {
    const { price, title, category } = product;

    // Update the DOM with product details
    const checkoutTotalElement = document.querySelector(".checkout-total");
    const productTitleElement = document.querySelector(".product-title");
    const productCategoryElement = document.querySelector(".product-category");

    if (checkoutTotalElement) {
        checkoutTotalElement.textContent = `${price}`; // Format price as needed
    }
    if (productTitleElement) {
        productTitleElement.textContent = title;
    }
    if (productCategoryElement) {
        productCategoryElement.textContent = category;
    }
}

// (5) Function to handle "Place order" button click
function handlePlaceOrder() {
    if (orderData) {
        // Get the userId from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('You are not logged in. Please log in to proceed.');
            return;
        }

        // Save the order to Firebase
        const newOrderRef = ref(database, 'orders/' + userId + '/' + Date.now());
        set(newOrderRef, orderData)
            .then(() => {
                console.log("Order successfully saved to Firebase");
                alert("Order placed successfully!");
            })
            .catch((error) => {
                console.error("Error saving order to Firebase:", error);
                alert("Failed to place the order. Please try again.");
            });
    } else {
        alert("No product data available to place an order.");
    }
}

// (6) Initialize page functionality
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('cardId');

    if (productId) {
        // Fetch product data and display it
        const product = await getProductData(productId);
        if (product) {
            orderData = {
                productId: productId,
                price: product.price,
                title: product.title,
                category: product.category,
                timestamp: new Date().toISOString()
            };
            displayProductData(product); // Update the UI with product details
        }
    } else {
        alert('No product selected for checkout');
    }

    // Add event listener to the "Place order" button
    const checkoutButton = document.querySelector("#chk");
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handlePlaceOrder);
    }
});
