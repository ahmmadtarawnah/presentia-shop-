// (1) Imports
import { auth, signInWithEmailAndPassword } from './shared/config.js';


// (2) Function to send data into Firebase
const handleLogin = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('userId', user.uid);
            return { success: true, user };
        } 
        catch (error) 
        {
            let errorMessage;
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } 
            else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No user found with this email.';
            } 
            else {
                errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
};  

// (3) Handle Form in HTML
const loginForm = document.getElementById('login-form');
const alertContainer = document.getElementById('alert-container');

loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const result = await handleLogin(email, password);
        
            if (result.success) 
            {
                alertContainer.innerHTML = '<div class="alert alert-success">Login successful!</div>';
                setTimeout(() => { window.location.href = '../html/home.html'; }, 2000);
            } 
            else 
            {
                alertContainer.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
            }
});