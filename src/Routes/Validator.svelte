<script>
    import { authToken } from './stores/authStore.js';
    import { user } from '/home/tomz/Almec/Test3/my-svelte-project/src/stores/auth.js';
    import { verifyToken } from './fetch/Fetch.svelte';

    // Subscribe to changes in the user store
    const unsubscribe = user.subscribe(value => {
        // Accessing authentication and admin status from the user store
        isAuth = value.isAuth;
        isAdmin = value.isAdmin;
        name = value.name;
    });

    // Function to decode JWT token and update user store
    async function updateUserInfo(token) {
        if (token) {
            try {
                // Make an HTTP request to verify the token
                const tokenResponse = await verifyToken(token); 
                const { auth, name, roles } = tokenResponse.user;
                user.set({ isAuth: auth, name, isAdmin: roles.includes('admin') });
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

    updateUserInfo(token);

</script>
    