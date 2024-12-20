<script>
  import globalStore from '../stores/global-store';
  import { fly, fade } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";


//close alert
  const handleCloseAlert = () => {
    globalStore.toggleItem("alert", false);
  };

  //close alert automatically after 3 seconds
  let timeout;
  onMount(() => {
    timeout = setTimeout(() => {
      globalStore.toggleItem("alert", false);
    }, 3000);
  });

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

<div
  class="alert-container"
  in:fly={{ y: -200, duration: 500 }}
  out:fly={{ y: -200, duration: 500 }}
  class:alert-danger={$globalStore.alertDanger} on:click={handleCloseAlert}>
  <div class="alert">
    <p>{$globalStore.alertText}</p>
  </div>
</div>

<style>
  .alert-container {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background: green;
    width: 23rem;
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--mainWhite);
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: capitalize;
    letter-spacing: var(--mainSpacing);
    border-radius: var(--mainBorderRadius);
  }
  
  .alert-center {
    position: relative;
  }

  .alert p {
    margin-bottom: 0;
    line-height: 2;
  }

  .alert-danger {
    background: var(--mainRed);
  }

  .alert-close {
    color: var(--mainWhite);
    font-size: 1.5rem;
    background: transparent;
    border: none;
    display: inline-block;
    position: absolute;
    top: 5px;
    right: 7px;
    cursor: pointer;
    line-height: 0;
  }
</style>