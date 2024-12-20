import { writable } from 'svelte/store';

// Retrieve the mode from localStorage or default to light mode
const initialMode = localStorage.getItem('darkMode') === 'true';
export const darkMode = writable(initialMode);

// Subscribe to changes in the darkMode store and update localStorage
darkMode.subscribe(value => {
  // @ts-ignore
  localStorage.setItem('darkMode', value);
});

