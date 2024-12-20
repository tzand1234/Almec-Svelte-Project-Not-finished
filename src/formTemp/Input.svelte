<script lang="ts">
  import { getContext } from 'svelte';
  export let type = 'text';
  export let label;
  export let name;
  export let listName;
  export let value
  const { onBlur, onInput, getSuggestions, suggestions } = getContext('form');
  const input_readonly = ['plaats', 'straat']
</script>

<label for={name}>{label}</label>
{#if input_readonly.includes(name)} 
  <input list={listName} id={name} value={value || ''} {name} {type} readonly/>
{:else}
  <input list={listName} id={name} {name} {type} value={value || ''} on:blur={onBlur} on:click={getSuggestions} on:keyup={getSuggestions} on:keyup={onInput} autocomplete="false"/>
{/if}
{#if listName !== "" && $suggestions.length > 0}
  <datalist id={listName}>
    {#each $suggestions as suggestion}
      <option value={suggestion}>{suggestion}</option>
    {/each}
  </datalist>
{/if}

