<script>
  import { activeLinkStore } from '../stores/activeLinkStore.js';
  import { onMount } from 'svelte';
  import { authToken } from './../stores/authStore.js';
  import { user, handleLogout } from '../stores/authStore.js';
  import UpButton from './UpButton.svelte';
  import Content from './Content.svelte';
  import Header from './Header.svelte';
  import Sidebar from './Sidebar.svelte';

  export let userInfo   
  let character

// saf
  // Use the store directly in the $: reactive statement
  $: currentSection = $activeLinkStore;

  // Function to handle section change
  function handleSectionChange(event) {
    activeLinkStore.set(event.detail.section);
  }

  onMount(async () => {
    try {
        const response = await fetch(`https://data.rma-v2.almec.nl/api/data/fetch/${$userInfo.name}`, {
            headers: {
                'Authorization': `Bearer ${$authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch character data');
        }

        character = await response.json();
    } catch (error) {
        console.error('Error fetching character data:', error);
    }
  });

</script>


{#if character}
  <Header userInfo={character}/>
{/if}

<div class="container">
    <Sidebar on:changeSection={handleSectionChange} />
    <Content {currentSection} character={character} />
    <UpButton /> 
</div>
