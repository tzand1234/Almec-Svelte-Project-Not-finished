<script>
	import { handleLogout } from '../stores/authStore.js';
    import { darkMode } from './../stores/darkMode.js';
    import { toggleSidebar } from './Sidebar.svelte';
    import { onMount } from 'svelte';

    let searchActive = false; // Initial state
    export let userInfo

    onMount(() => {
        const modeToggle = document.querySelector(".dark-light");

        // Subscribe to changes in the darkMode store
        const unsubscribeDarkMode = darkMode.subscribe(value => {
            document.body.classList[value ? 'add' : 'remove']('dark');
            modeToggle.classList[value ? 'add' : 'remove']('active');
        });

        // Cleanup subscriptions on component destruction
        return () => {
            unsubscribeDarkMode();
        };
    });

    // Function to toggle dark mode
    export const toggleDarkMode = () => {
        darkMode.update(value => !value);
    };

</script>

<!-- Header begins -->
<header>
    <div class="centered">
        <div class="inner_center">
            <button id="menu-btn" class="sub-menu-link" on:click={() => toggleSidebar()}>
                <span class="material-icons">menu</span>
            </button>
            <img src={almecLogo} alt="Logo Almec" title="Logo Almec" class="logo">
        </div>
        <div class="icons">
            <div class="profile">
                <div class="dark-light" on:click={toggleDarkMode}>
                    <i class='bx bx-moon moon'></i>
                    <i class='bx bx-sun sun'></i>
                </div>
                <div class="info">
                    <p>Hey, <b>{userInfo.user.bedrijfsnaam}</b></p>
                    <small class="text-muted">{userInfo.user.roles}</small>
                    <button on:click={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    </div>
</header>

<style>
    /* ======== CENTER CLASS ======== */
    .centered {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .inner_center {
        display: flex;
        align-items: center;
    }

    /* ======== CENTER CLASS END ======== */

    /* ======== SUB MENU ======== */
    .dark-light {
        padding: 10px;
    }

    .sub-menu-wrap.open-menu,
    .sub-menu-wrap-notifications.open-menu {
        max-height: 400px;
    }

    .sub-menu,
    .sub-menu-notifications {
        background: var(--color-white);
        padding: 20px;
        margin: 10px;
    }

    .sub-menu-wrap,
    .sub-menu-wrap-notifications {
        position: absolute;
        width: 320px;
        max-height: 0;
        top: 7%;
        overflow: hidden;
        z-index: 1;
        transition: max-height 0.5s;
    }

    .sub-menu hr {
        border: 0;
        height: 1px;
        width: 100%;
        background: #ccc;
        margin: 15px 0 10px;
    }

    .sub-menu a.sub-menu-link {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-bottom: 15px;
        padding-top: 15px;
        color: var(--color-primary);
        transition: all 300ms ease;
    }

    .sub-menu-link span {
        width: 40px;
        background: var(--color-light);
        border-radius: var(--border-radius-3);
        padding: 8px;
    }

    .profile a.sub-menu-link {
        transition: all 300ms ease;
    }

    .profile a.sub-menu-link:hover,
    .sub-menu a.sub-menu-link:hover {
        color: var(--color-danger);
    }

    /* ======== SUB MENU END ======== */

    header>div>div>img:nth-child(-n + 4) {
        margin-left: 12px;
    }

    /* ======== RECENT UPDATES ======== */

    .recent-updates {
        margin-right: 15px;
    }


    @media screen and (max-width: 768px) {
        .container {
            grid-template-columns: 1fr;
            width: 90%;
        }

        .centered {
            padding: 15px 15px 0px 15px;
        }

        button {
            display: inline-block;
            background: transparent;
            cursor: pointer;
            color: var(--color-dark);
            left: 1rem;
            transition: all 300ms ease;
        }
    }

    .profile-photo {
        width: 2.8rem;
        height: 2.8rem;
        border-radius: 50%;
        overflow: hidden;
    }

    .text-muted {
        color: var(--color-info-dark);
    }

    .message {
        margin-top: 15px;
    }

    /* ======== THEME TOGGLER ======== */
    .theme-toggler {
        background: var(--color-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.6rem;
        width: 4.2rem;
        cursor: pointer;
        border-radius: var(--border-radius-1);
    }

    .theme-toggler span {
        font-size: 1.2rem;
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .theme-toggler span.active {
        background: var(--color-primary);
        color: white;
        border-radius: var(--border-radius-1);
    }

    /* ======== THEME TOGGLER END ======== */

    /* ======== USER IFO BEGINS ======== */
    .user-info {
        display: flex;
        align-items: center;
    }

    .user-info h3 {
        font-weight: 500;
    }

    .user-info img {
        width: 60px;
        border-radius: 50%;
        margin-right: 15px;
    }

    /* ======== USER IFO END ======== */

    /* ========  ICONS CLASS BEGIN ======== */
    .icons {
        display: flex;
        align-items: center;
        margin-right: 15px;
        gap: 11px 39px;
    }

    /* ========  ICONS CLASS END ======== */

    /* ======== MEDIA ======== */
    @media screen and (max-width: 768px) {
        header>div>div.inner_center>img {
            display: none;
        }

        .inner_center {
            gap: 15px;
        }

        .theme-toggler {
            width: 4.4rem;
            position: absolute;
            left: 66%;
        }

        .profile .info {
            display: none;
        }
    }

    @media (max-width: 483px) {
        .centered h1 {
            display: none;
        }

        .centered {
            padding: 15px 15px 0px 15px;
        }
    }

    /* ======== MEDIA END ======== */
</style>
