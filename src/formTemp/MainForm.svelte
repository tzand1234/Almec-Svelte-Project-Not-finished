<script lang="ts">
	import globalStore from '../stores/global-store';
	import { formRegister, formLogin } from './../stores/formValidationRules.js';
  import Form from './Form.svelte';
  import Input from './Input.svelte';
  import Error from './Error.svelte';
  import  { setAuthToken }   from './../stores/authStore.js';
  import { fetchData, addData, loginAndGetToken } from './../fetch/Fetch.svelte';
  let formEl;
  export let form;
  export let formData;
  export let apiUrl
  export let login
  let isMember = true;
  const token = localStorage.getItem('authToken') || '';
  
    
  

  // onMount(() => {
  //     fetch("http://localhost:3000/api/generateCsrfToken")
  //       .then(response => response.json())
  //       .then(data => {
  //           let csrfToken = data.csrfToken;
  //           console.log(csrfToken);
  //       })
  //       .catch(error => {
  //           console.error('Error fetching CSRF token:', error);
  //       });
  //   });


  function toggleMember() {
    isMember = !isMember;
    if (!isMember) {
      form = formRegister;
      apiUrl="http://localhost:3000/api/data/register"
    } else {
      form = formLogin;
      apiUrl=''
    }
  }

  async function getDataAndAssign() {
    try {
      if (!formData) {
          return;
      }
      
      const fieldsKeys = Object.keys(form);   
      const fieldsValues = Object.values(form); // Extract field objects from form object

      // Iterate over fields and assign values from formData
      fieldsKeys.forEach((key, index) => {    
          const field = fieldsValues[index];
          // Assign the value from formData to the field   
          const fieldValue = formData.user[key];
          
          if (fieldValue != null) { // Check for null or undefined
              field.bindValue = fieldValue;
          } else {
              // Handle empty values as needed
              field.bindValue = ''; // For example, set to an empty string
          }
      });
    } catch (error) {
        console.error("Error fetching and assigning form data:", error);
        throw error; // or handle the error appropriately
    }
  };

  // Execute fetchDataAndAssign when userId changes or when the component is mounted
  $: getDataAndAssign();

  // Handle form submission
  async function onSubmit(e) {
    try {
      if (e?.detail?.valid) {
        // If there's an API URL, add data using API
        if (apiUrl !== '') {
          await addData(e.detail.data, apiUrl, token);             
          // form = formLogin
        } else {
          try {
            // Attempt login and get token
            const token = await loginAndGetToken(e.detail.data);
            if (token) {
              // Set the authToken store with the obtained token
              setAuthToken(token);
            }
          } catch (error) {
            console.error('Failed to login:', error);
            globalStore.toggleItem("alert", true, "Inloggen mislukt. Probeer het opnieuw.", true);
          }
        }
      } else {
        // Log invalid form submission
        console.log('Invalid Form:', e);
        globalStore.toggleItem("alert", true, "Inloggen mislukt. Probeer het opnieuw.", true);
      }
    } catch (error) {
      // Handle any unexpected errors
      globalStore.toggleItem("alert", true, "Inloggen mislukt. Probeer het opnieuw.", true);
    }
  }
</script>

<div class="container-form">
  <!-- Render form with inputs and errors -->
  <Form {form} on:submit={onSubmit} bind:this={formEl}>
    {#each Object.entries(form) as [key, field]}
      <div class="input">
        {#if field.list}
          <Input listName={key + "List"} label={key} name={key} value={field.bindValue} />
        {:else}
          <Input listName="" label={key} name={key} value={field.bindValue}  />
        {/if}
        {#if field.validators}
          {#each field.validators as validator}
            {#each Object.keys(validator()) as errorKey}          
              <Error fieldName={key} errorKey={errorKey} message={validator()[errorKey].message} />
            {/each}
          {/each}
        {/if}
      </div>
    {/each}
    <button class="btn" type="submit">Submit</button>
    {#if login}
      {#if isMember}
        <p class="register-link">
          Need to register?
          <button type="button" on:click={toggleMember}>click here</button>
        </p>
      {:else}
        <p class="register-link">
          already a member?
          <button type="button" on:click={toggleMember}>click here</button>
        </p>
      {/if}
    {/if}
  </Form>
</div>

<style>
  /* Button Styling */
  .btn {
    margin-top: 15px;
    padding: 10px 30px;
    border: none;
    border-radius: 5px;
    background-color: #34495e;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
  }

  .register-link {
    text-align: center;
  }

  .btn:hover {
    background-color: #7bdcb5;
  }

  /* Input Styling */
  .form-input-material {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: none;
    border-bottom: 2px solid #ccc;
    outline: none;
    background: transparent;
    color: white;
    transition: border-bottom-color 0.3s;
  }

  .form-input-material:focus {
    border-bottom-color: #4caf50;
  }

  .input {
    display: grid;
  }
  
  /* Form Styling */
  .container-form {
    padding: 20px 20px;
    color: white;
    border-radius: 10px;
    box-shadow: 0 0.4px 0.4px rgba(128, 128, 128, 0.109),
      0 1px 1px rgba(128, 128, 128, 0.155),
      0 2.1px 2.1px rgba(128, 128, 128, 0.195),
      0 4.4px 4.4px rgba(128, 128, 128, 0.241),
      0 12px 12px rgba(128, 128, 128, 0.35);
  }
</style>
