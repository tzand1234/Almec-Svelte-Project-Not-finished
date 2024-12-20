<script>
	import globalStore from '../src/stores/global-store.js';
    import { Router, Route} from "svelte-routing";
	import Alert from './loading/Alert.svelte';
    import { formRegister, formLogin } from './stores/formValidationRules.js';
    import { user } from '../src/stores/authStore.js';
    import MainForm from './formTemp/MainForm.svelte';
    import UserPage from '../src/user/UserPage.svelte';
    import AdminDashboard from '../src/admin/Admin.svelte';
    import PrivateRoute from './Routes/PrivateRoute.svelte';
</script>

<main>
    <Router >
        {#if !$user.isAuth}
            <Route path="*">
                <MainForm login=true formData="" apiUrl="" form={formLogin}/>
            </Route>

            <Route path="/register">
                <MainForm userId="" apiUrl="https://data.rma-v2.almec.nl/api/data/register" form={formRegister}/>
            </Route>
        {:else}
            <PrivateRoute path="*" let:location>
                <UserPage userInfo={user}/>
            </PrivateRoute>

            {#if $user.isAdmin}
                <PrivateRoute path="admin" let:location>
                    <AdminDashboard userInfo={user} />
                </PrivateRoute>
            {/if}
        {/if}
    </Router>

    {#if $globalStore.alert} 
        <Alert />
    {/if}
</main>

