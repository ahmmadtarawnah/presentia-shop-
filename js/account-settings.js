import { auth, database } from './shared/config.js';
import { ref, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { monitorAuthState } from './shared/auth.js';

// DOM Elements
const profileForm = document.getElementById('profile-settings-form');
const alertContainer = document.getElementById('alert-container');
const genderSelect = document.getElementById('gender-select');
const profilePicture = document.getElementById('profile-picture');


// Event listener for gender change
let selectedGender = "male";
genderSelect.addEventListener('change', () => {
    selectedGender = genderSelect.value;
    if (selectedGender === "male") {
        profilePicture.src = "../img/Man.png";
    } else if (selectedGender === "female") {
        profilePicture.src = "../img/Women.png";
    }
});


/**
 * Loads user data when authenticated and populates the form fields.
 * If the user is not authenticated, redirects them to the login page.
 */
async function loadUserData(userId) {
    try {
        const userRef = ref(database, 'users/' + userId);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.val();

            // Populate the form fields with fetched data
            document.getElementById('first-name').value = userData.firstName || '';
            document.getElementById('last-name').value = userData.lastName || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('birthdate').value = userData.birthDate || '';
            document.getElementById('phone-number').value = userData.phoneNumber || '';
            document.getElementById('address').value = userData.city || '';
            document.getElementById('preferred-gift-categories').value = userData.preferredGiftCategories || '';

            // Set gender and profile picture based on user data
            if (userData.gender) {
                genderSelect.value = userData.gender;
                selectedGender = userData.gender; // Set gender from Firebase
            }
            if (userData.profilePicture) {
                profilePicture.src = userData.profilePicture;
            } else {
                // Default to male if no picture is saved
                profilePicture.src = selectedGender === "male" ? "../img/Man.png" : "../img/Woman.png";
            }
        } else {
            showAlert('warning', 'User data not found.');
        }
    } catch (error) {
        showAlert('danger', `Failed to load user data: ${error.message}`);
    }
}

/**
 * Updates user data in the Realtime Database when the form is submitted.
 */
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission

    const userId = localStorage.getItem('userId');
    if (!userId) {
        showAlert('danger', 'User not logged in.');
        return;
    }

    const updatedData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        birthDate: document.getElementById('birthdate').value,
        phoneNumber: document.getElementById('phone-number').value,
        city: document.getElementById('address').value,
        preferredGiftCategories: document.getElementById('preferred-gift-categories').value,
        gender: selectedGender, // Save selected gender
        profilePicture: profilePicture.src, // Save the updated profile picture URL
    };

    try {
        const userRef = ref(database, 'users/' + userId);
        await update(userRef, updatedData);
        showAlert('success', 'Profile updated successfully!');
        loadUserData(userId); // Reload user data after update
    } catch (error) {
        showAlert('danger', `Failed to update profile: ${error.message}`);
    }
});

/**
 * Initialize the page by checking the user's authentication state.
 */
document.addEventListener('DOMContentLoaded', () => {
    monitorAuthState((user) => {
        if (user) {
            localStorage.setItem('userId', user.uid); // Save user ID to localStorage
            loadUserData(user.uid); // Load user data
        } else {
            localStorage.removeItem('userId');
            showAlert('danger', 'You are not logged in. Redirecting to login page...');
            setTimeout(() => {
                window.location.href = '../html/login.html'; // Redirect to login page
            }, 2000);
        }
    });
});

/**
 * Helper function to show alerts in the UI.
 * @param {string} type - Alert type (success, warning, danger).
 * @param {string} message - The message to display.
 */
function showAlert(type, message) {
    alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        alertContainer.innerHTML = ''; // Clear the alert after 5 seconds
    }, 5000);
}

// Function to fetch and display orders for the current user
function fetchAndDisplayOrders() {
    // Get the userId from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('You are not logged in. Please log in to view your orders.');
        return;
    }

    // Reference to the orders in Firebase
    const ordersRef = ref(database, 'orders/' + userId);

    // Fetch orders from Firebase
    get(ordersRef)
        .then((snapshot) => {
            const cardBody = document.querySelector('.order');
            if (snapshot.exists()) {
                const orders = snapshot.val();
                let ordersHTML = '';

                // Loop through each order and construct HTML
                for (const orderId in orders) {
                    const { title, price, category } = orders[orderId];

                    ordersHTML += `
                        <div class="container bootdey">
                            <div class="panel panel-default panel-order">
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <img src="../img/order2.png" class="media-object img-thumbnail" />
                                        </div>
                                        <div class="col-md-10">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <span><strong>${title}</strong></span>
                                                    <span class="label label-info">Order ID: ${orderId}</span><br />
                                                    <strong>Cost:</strong> ${price}<br />
                                                    <strong>Category:</strong> ${category}<br />
                                                    <a data-placement="top" class="btn btn-success btn-xs glyphicon glyphicon-ok mt-3" href="checkout.html" title="View">Buy Again</a>
                                                    <br><br><br>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                // Display the orders in the card-body div
                cardBody.innerHTML = ordersHTML;
            } else {
                // No orders found
                cardBody.innerHTML = 'No Data';
            }
        })
        .catch((error) => {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders. Please try again later.');
        });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayOrders);
