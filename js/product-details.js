import { database, ref, set, get } from "./shared/config.js";
import { push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// (1) Function to handle checkout logic and display product details
async function getProductData(productId) {
    const productRef = ref(database, "products/" + productId);
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log("No product data found");
        return null;
    }
}

// (2) Function to display product details on the page
async function displayProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("cardId");

    if (productId) {
        const productData = await getProductData(productId);

        if (productData) {
            const titleElement = document.querySelector(".pro-d-title a");
            if (titleElement) {
                titleElement.textContent = productData.title.toUpperCase();
                titleElement.href = "#";
            }

            const priceElement = document.querySelector(".pro-price");
            if (priceElement) {
                priceElement.textContent = `${productData.price}`;
            }

            const imgElement = document.querySelector(".pro-img-details img");
            if (imgElement) {
                imgElement.src = productData.image;
            }

            const descriptionElement = document.querySelector(".pro-d-title + p");
            if (descriptionElement) {
                descriptionElement.textContent = productData.description;
            }

            const categoryElement = document.querySelector(".categories");
            if (categoryElement) {
                categoryElement.textContent = productData.category.toLowerCase();
            }
            }
    } else {
        alert("No product selected");
    }
}

// (3) Function to get the logged-in user's name from localStorage
async function getUserName() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        return "Visitor";
    }

    const userRef = ref(database, "users/" + userId);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const fName = userData.firstName;
        const lName = userData.lastName;
        return `${fName || ""} ${lName || ""}`.trim();
    } else {
        console.error("User data not found in Firebase");
        return "Visitor";
    }
}

// (4) Function to display product reviews
function generateStarRating(rating) {
  const fullStar = "⭐"; // Unicode for filled star
  const emptyStar = ""; // Unicode for empty star
  const maxStars = 5; // Max number of stars

  let stars = fullStar.repeat(rating); // Filled stars
  stars += emptyStar.repeat(maxStars - rating); // Empty stars

    return `<span class="star-rating">${stars}</span>`;
}
async function displayReviews(productId) {
    const reviewsRef = ref(database, "reviews/" + productId);
    const snapshot = await get(reviewsRef);

    const reviewsContainer = document.querySelector(".reviews");
    reviewsContainer.innerHTML = "";

    if (snapshot.exists()) {
        const reviews = snapshot.val();
        for (const review of Object.values(reviews)) {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");

            const starRating = generateStarRating(review.rating);

            reviewElement.innerHTML = `
                <h5>${review.user}</h5>
                <p>${starRating}</p>
                <p>${review.comment}</p>
            `;
            reviewsContainer.appendChild(reviewElement);
        }
    } else {
        reviewsContainer.innerHTML = "<p>No reviews found.</p>";
    }
}

// (5) Function to add a new review to Firebase
async function addReview(productId, comment, rating) {
    const userName = await getUserName();
    const newReviewRef = push(ref(database, "reviews/" + productId));
    await set(newReviewRef, {
        user: userName,
        comment: comment,
        rating: rating,
    });

    displayReviews(productId);
}

// (6) Event listener to handle the submit event for adding a new review
document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const textarea = document.querySelector("form textarea");
    const comment = textarea.value.trim();
    const rating = document.querySelector('input[name="rating"]:checked')?.value;

    if (comment && rating) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("cardId");

        if (productId) {
            await addReview(productId, comment, rating);
            textarea.value = "";
            document.querySelector('input[name="rating"]:checked').checked = false;
        }
    } else {
        alert("Please provide a comment and select a rating.");
    }
});

// (7) Call the displayProductDetails and displayReviews functions when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("cardId");

    if (productId) {
        await displayProductDetails();
        await displayReviews(productId);
    }
});
