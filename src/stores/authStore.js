import { writable } from 'svelte/store';
import { verifyToken } from '../fetch/Fetch.svelte';
import { navigate } from "svelte-routing";

// Define a writable store for user authentication, admin status, and name
export const user = writable({
  isAuth: false, // Initial authentication status
  isAdmin: false, // Initial admin status
  name: "", // Initial name
});

// Function to decode JWT token and update user store
export async function updateUserInfo(token) {
  if (token) {
    try {
      // Make an HTTP request to verify the token
      const tokenResponse = await verifyToken(token); 
      if (tokenResponse) {
        const { auth, name, roles } = tokenResponse.user;
        // Update user store with authentication status
        user.set({ isAuth: auth, name, isAdmin: roles.includes('admin') });
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      // Clear invalid token from local storage
      localStorage.removeItem('authToken');
      // Update user store with authentication status
      user.set({ isAuth: false, name: "", isAdmin: false });
      // Propagate the error for handling by the caller
      throw error;
    }
  }
}

// Function to handle user logout
export function handleLogout() {
  // Clear the token from local storage
  localStorage.removeItem('authToken');
  // Update the user store to logout the user
  user.set({ isAuth: false, isAdmin: false, name: "" });
  // Navigate to the login page
  navigate("/", { replace: true });
}

// Watch for changes in the authentication token and update user info accordingly
export const authToken = writable(localStorage.getItem('authToken') || '');
authToken.subscribe(token => {
  updateUserInfo(token);
});

// Function to set the authentication token in the store and local storage
export function setAuthToken(token) {
  authToken.set(token);
  // Update user info with the new token
  updateUserInfo(token);
  // Store the token in localStorage
  localStorage.setItem('authToken', token);
}
