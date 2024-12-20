<script>
    export const showOnPx = 150;
    let hidden = true;

    function goTop() {
        document.body.scrollIntoView({
            behavior: 'smooth'
        });
    }

    function scrollContainer() {
        return document.documentElement || document.body;
    }

    function handleOnScroll() {
        if (!scrollContainer()) {
            return;
        }

        hidden = scrollContainer().scrollTop <= 0;
    }
</script>

<style>
    /* Style the button as needed */
    button {
        position: fixed;
        bottom: 20px;
        padding: 10px;
        background-color: var(--color-background);
        color: var(--color-dark);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: opacity 0.5s, visibility 0.5s;
    }

    .hidden {
        opacity: 0;
        visibility: hidden;
    }
</style>

<svelte:window on:scroll={handleOnScroll} />

<button on:click={goTop} class:hidden={hidden}>Scroll to Top</button>
