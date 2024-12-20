<script context="module">
    export const sidebarOpen = writable(false);
    export function toggleSidebar() {
        sidebarOpen.update(value => !value);
    }
</script>

<script>
    // import almecLogo from '../assets/logo.png';
    import { writable } from 'svelte/store';
    import { createEventDispatcher } from 'svelte';
    import { activeLinkStore } from '../stores/activeLinkStore.js';
    const dispatch = createEventDispatcher();

    // Subscribe to changes in the activeLinkStore
    $: activeLink = $activeLinkStore;

    // Function to handle click events
    function handleClick(section) {
        activeLinkStore.set(section); // Update activeLinkStore
        dispatch('changeSection', {
            section
        });
    }

    const menuItems = [{
            id: 'dashboard',
            icon: 'grid_view',
            label: 'Dashboard'
        },
        {
            id: 'customers',
            icon: 'person_outline',
            label: 'Customers'
        },
    ];
</script>

<aside style="width: {$sidebarOpen ? '100%' : '0%'}">
    <nav class="sidebar">
        <!-- Close button begins -->
        <a class="closebtn" on:click={() => toggleSidebar()}>&times; <h3>Menu sluiten</h3></a>
        <img src={almecLogo} alt="Logo Almec" title="Link naar de homepage" class="logo">
        <!-- Close button ends -->

        <!-- Categorieën button begins -->
        <span class="menu-title">
            <h3>Categorieën</h3>
        </span>
        <!-- Categorieën button ends -->

        <!-- Loop to generate menu items -->
        {#each menuItems as item (item.id)}
        <a class:active={activeLink === item.id} on:click={() => handleClick(item.id)}>
            <span class="material-icons">{item.icon}</span>
            <h3>{item.label}</h3>
        </a>
        {/each}
    </nav>
</aside>

<style>
    /* ======== ASIDE BEGINS ======== */
    aside {
        width: 0%;
    }

    .menu-title,
    .sidebar .logo {
        display: none;
    }

    aside .sidebar a.closebtn {
        display: none;
        font-size: 36px;
    }

    aside .sidebar {
        display: flex;
        flex-direction: column;
    }

    aside h3 {
        font-weight: 500;
    }

    aside .sidebar a {
        display: flex;
        color: var(--color-info-dark);
        margin-left: 2rem;
        gap: 1rem;
        align-items: center;
        position: relative;
        height: 3.7rem;
        transition: all 300ms ease;
    }

    aside .sidebar a span {
        font-size: 1.6rem;
        transition: all 300ms ease;
    }

    aside .sidebar a.active {
        background: var(--color-light);
        color: var(--color-primary);
        margin-left: 0;
    }

    aside .sidebar a.active::before {
        content: '';
        width: 6px;
        height: 100%;
        background: var(--color-primary);
    }

    aside .sidebar a:hover {
        color: var(--color-danger)
    }

    aside .sidebar a:hover span {
        margin-left: 1rem;
    }

    aside .sidebar .message-count {
        background: var(--color-danger);
        color: var(--color-white);
        padding: 2px 10px;
        font-size: 11px;
        border-radius: var(--border-radius-1);
    }

    /* ======== ASIDE ENDS ======== */

    @media screen and (max-width: 1200px) {

        /* ======== ASIDE BEGINS ======== */
        aside .logo h2 {
            display: none;
        }

        aside .sidebar h3 {
            display: none;
        }

        aside .sidebar a {
            width: 5.6rem;
        }

        aside {
            display: block;
            width: 0%;
        }

        /* ======== ASIDE ENDS ======== */
    }

    @media screen and (max-width: 768px) {

        /* ======== ASIDE BEGINS ======== */
        aside {
            background: var(--color-white);
            box-shadow: 1rem 3rem 4rem var(--color-light);
            height: 100%;
            position: fixed;
            z-index: 1;
            left: 0;
            width: 0;
            top: 0;
            overflow-x: hidden;
            transition: 0.5s;
        }

        .menu-title {
            margin: 15px;
            display: block;
        }

        .sidebar .logo {
            display: block;
            width: 50%;
        }

        aside .sidebar .logo {
            margin-left: 1rem;
        }

        aside .logo h2 {
            display: inline;
        }

        aside .sidebar h3 {
            display: inline;
        }

        aside .sidebar a {
            width: 100%;
            height: 3.4rem;
        }

        aside .sidebar a.closebtn {
            display: flex;
            font-size: 36px;
            height: 5rem;
            margin: 0;
            padding-left: 15px;
        }

        /* ======== ASIDE ENDS ======== */
    }
</style>
