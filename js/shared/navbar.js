// (1) Import necessary functions
import { monitorAuthState, logoutUser } from './auth.js';

// (2) Function to load the navbar based on login status
function loadNavbar(isLoggedIn) {
    console.log("Is Logged In:", isLoggedIn); // Add a log to verify the value
    const navbarPath = isLoggedIn ? '../html/shared/logged-navbar.html' : '../html/shared/navbar.html';
    console.log("Fetching navbar from:", navbarPath); // Log the path being used for fetching
    
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch navbar');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            document.getElementById('navbar-placeholder').innerHTML = data;

            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    logoutUser(); // Use the logoutUser function from auth.js
                });
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
}




// (4) Monitor authentication state and load appropriate navbar
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';  // Read from localStorage initially
    loadNavbar(isLoggedIn);  // Load the appropriate navbar

    monitorAuthState((user) => {
        const isLoggedIn = !!user;
        localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
        loadNavbar(isLoggedIn);  // Load navbar based on the authentication state
    });
});
