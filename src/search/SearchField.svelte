<script>
  import globalStore from '/home/tomz/Desktop/Unhear/svelte-app/src/stores/global-store';
  import { fly, blur } from 'svelte/transition';
  import Loading from './../loading/Loading.svelte';
  import { onDestroy } from 'svelte';
  import { clickOutside } from '/home/tomz/Desktop/Unhear/svelte-app/src/admin/Nav/clickOutside.js';


  let showSearch = false;
  let search = '';
  let products = [];
  let timeout;
  let searching = false;

  const handleSearch = () => {
    searching = true;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(getProducts, 300);
  };

  const getProducts = async () => {
    if (!search) {
      reset();
      return;
    }

    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${search}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      products = data?.products || [];
    } catch (error) {
      handleError();
    } finally {
      searching = false;
    }
  };

  const handleError = () => {
    alert('Something went wrong.');
    reset();
  };

  const reset = () => {
    products = [];
    searching = false;
  };

	
	function handleClickOutside(event) {
		globalStore.toggleItem('search', false);
	}
</script>

<div class="cart-overlay" transition:blur>
    <div class="search-button">
        <div class="search-popup" transition:fly={{ y: 100 }}>
            <button class="btn-close" on:click={() => globalStore.toggleItem('search', false)}>
            <i class="fas fa-window-close" />
            </button>
            <div class="search-form" use:clickOutside on:click_outside={handleClickOutside} style="width: {showSearch ? '50' : '100vw'}">
                <div class="search_field">
                    <label for="search">Search</label>
                    <input class="search" id="search" bind:value={search} on:input={handleSearch} />
                    {#if searching}
                    <Loading />
                    {/if}
                    <ul>
                    {#each products as product}
                        <li>{product.title} ({product.price}€)</li>
                    {/each}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<style>

  ul {
      position: fixed;
      background: var(--color-background);
      color: var(--white);
  }


  input {
      border: 2px solid var(--white);
  }

  .cart-overlay {
      background: rgb(0 0 0 / 40%);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
  }

  /* Search button */
  .search-button {
      position: relative;
      display: inline-block;
      /* Adjust margin as needed */
  }

  .search_field {
      margin: 15px auto;
      padding: 15px;
  }

  .search-button button {
      border: none;
      background-color: transparent;
      color: var(--white);
      cursor: pointer;
      font-size: 20px;
      z-index: 999;
      padding: 15px;
      position: absolute;
  }

  @media (max-width:920px) {
      .search-button button {
          font-size: 1.8rem;
      }
  }

  /* Search popup */
  .search-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      display: flex;
  }

  .search-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: -1;
  }

  .search-form {
      position: absolute;
      padding: 20px;
      transition: width 0.3s ease;
      background-color: var(--color-white);
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
  }

  .form {
      position: relative;
  }

  ul,
  .search {
    width: calc(100% - 40px);
  }

  .form input {
      width: calc(100% - 40px);
      padding: 10px;
      border: none;
      border-bottom: 1px solid #ccc;
      outline: none;
      font-size: 16px;
      margin-bottom: 20px;
  }

  .form input:focus {
      border-bottom: 1px solid #007bff;
  }

  .form label {
      position: absolute;
      top: 12px;
      right: 10px;
      color: #ccc;
      cursor: pointer;
      font-size: 16px;
  }

  .form label:hover {
      color: #007bff;
  }
</style>
