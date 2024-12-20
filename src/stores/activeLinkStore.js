// activeLinkStore.js

import { writable } from 'svelte/store';

// Function to load the initial value from localStorage
const storedValue = localStorage.getItem('activeLink');
export const activeLinkStore = writable(storedValue ? storedValue : '');

// Subscribe to changes in the store and update localStorage
activeLinkStore.subscribe(value => {
  localStorage.setItem('activeLink', value);
});