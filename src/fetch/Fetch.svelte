<script>
	import { navigate } from 'svelte-routing';
	import globalStore from '../stores/global-store';
    import { data } from './../stores/dataStore.js';
    import { onMount } from 'svelte';

    const token = localStorage.getItem('authToken') || '';

    export let url;

    onMount(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Set a timeout of 5 seconds (5000 milliseconds)

        try {
            const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }, signal: controller.signal}).then(response => response.json()).then(array => { data.set(array);})
        } catch (error) {
            globalStore.toggleItem("alert", true, "Server error", true);
            return null;
        } finally {
            clearTimeout(timeoutId); // Clear the timeout
        }
    });
</script>

<script context="module">
    export async function addData(newData, url, token) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newData),
            });
            if (response.ok) {
                const addedData = await response.json();
                globalStore.toggleItem("alert", true, "Added new data", false);
            } else {
                const { error } = await response.json();
                globalStore.toggleItem("alert", true, error, true);
            }
        } catch (error) {
            console.error(error);
            globalStore.toggleItem("alert", true, "Server error", true);
        }
    };

    // Function to verify token
    export const verifyToken = async (token) => {
        try {
            const response = await fetch('https://data.rma-v2.almec.nl/api/verifytoken', {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in the request headers
                }
            });
            if (response.ok) {
                // Token is valid
                return await response.json();
            } else {
                // Token verification failed
                const { error } = await response.json();
                globalStore.toggleItem("alert", true, error, true);
            }
        } catch (error) {
            globalStore.toggleItem("alert", true, error, true);
        }
    };

    export async function loginAndGetToken(newData) {
        try {
            const response = await fetch('https://data.rma-v2.almec.nl/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (response.ok) {
                const { token } = await response.json();
                globalStore.toggleItem("alert", true, "Welkom", false);
                return token;
            } else {
                const { error } = await response.json();
                globalStore.toggleItem("alert", true, error, true);
            }
        } catch (error) {
            console.error(error);
            globalStore.toggleItem("alert", true, "Server error", true);
            throw error;
        }
    };

    export async function fetchData(name, token) {
        try {
            const response = await  fetch(`https://data.rma-v2.almec.nl/api/data/fetch/${name}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const userData = await response.json();
                return userData; 
            } else {
                const { error } = await response.json();
                globalStore.toggleItem("alert", true, error, true);
            }
        } catch (error) {
            globalStore.toggleItem("alert", true, "Server error", true);
        }
    };


    export async function updateProduct(productData, token) {
        try {
            // Make a fetch request to your backend API endpoint
            const response = await fetch(`https://data.rma-v2.almec.nl/api/data/products/${productData._id}`, {
                method: 'POST', // Assuming you're using HTTP PUT for update operation
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(productData), // Convert product data to JSON string
            });

            console.log(response);
            if (!response.ok) {
                const { error } = await response.json();
                globalStore.toggleItem("alert", true, error, true);
            }

            // If the request is successful, parse the response JSON and return the updated product data
            const updatedProduct = await response.json();
            return updatedProduct;
        } catch (error) {
            globalStore.toggleItem("alert", true, "Server error", true);
        }
    }

    // Fetch CSRF token from the server
    export async function fetchCsrf() {
        const response = await fetch('https://data.rma-v2.almec.nl/api/csrf-token');
        return await response.json();
    };
</script>
