<script>
    import { onDestroy } from 'svelte'; // Import onDestroy to manage cleanup
    import { authToken } from '../stores/authStore.js';
    import { navigate } from 'svelte-routing'; // Import navigate function from svelte-routing

    // Function to redirect to the login page after a short delay
    async function redirectToLogin() {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for rendering
        navigate('/', { replace: true });
    }

    // Watch for changes in the authentication token
    let authTokenValue = $authToken;

    // Redirect to the login page if the user is not authenticated
    $: {
        if (!authTokenValue) {
            redirectToLogin();
        }
    }
</script>

<!-- Your component content -->
{#if $authToken}
    <slot />
{/if}