<script lang="ts">
  import { setContext } from 'svelte';
  import type { ValidatorFn, ValidatorResult } from './Validators';
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  export let form: {
    [inputName: string]: {
      validators: ValidatorFn[];
    };
  } = {};

  let formEl;
  let suggestionsData = [];
  let postcode = "", huisnummer = "", huisnummerToevoeging = "";
  const dispatch = createEventDispatcher();
  const domainSuggestions = ['gmail.com', 'yahoo.com', 'outlook.com'];
  const boxSuggestions = [1, 2, 3, 4, 5]
  let errors = writable({});
  let suggestions = writable([]);

  function onBlur(e) {
    validateField(e.target.name, e.target.value);
  }

  function onInput(e) {
    validateField(e.target.name, e.target.value);
  }

  async function getSuggestions(e) {
    try {
        if (e.target.name === "email") {
            const inputWithoutDomain = e.target.value.split('@')[0];
            await suggestions.set(domainSuggestions.map(domain => `${inputWithoutDomain}@${domain}`));
            return;
        }
        
        if (e.target.name == "dozen") {
            const inputWithoutDomain = e.target.value;
            await suggestions.set(boxSuggestions.map(domain => `${domain}`));
            return;
        }

        switch (e.target.name) {
            case "postcode":
                postcode = e.target.value.trim();
                break;
            case "huisnummer":
                huisnummer = e.target.value.trim();
                break;
            case "huisnummerToevoeging":
                huisnummerToevoeging = e.target.value.trim();
                break;
        }

        if (postcode.length === 0 || huisnummer.length === 0) {
          return; // Don't proceed if postcode or huisnummer is empty
        }

        // Construct the query string
        const query = `${postcode} ${huisnummer} ${huisnummerToevoeging}`;
        const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=${query}&fl=id%20weergavenaam%20type%20score%20adrestype&fq=type%3A%28gemeente%20OR%20woonplaats%20OR%20weg%20OR%20postcode%20OR%20adres%29&qf=exacte_match%5E1%20suggest%5E0.5%20huisnummer%5E0.5%20huisletter%5E0.5%20huisnummertoevoeging%5E0.5&bq=type%3Aprovincie%5E1.5&bq=type%3Agemeente%5E1.5&bq=type%3Awoonplaats%5E1.5&bq=type%3Aweg%5E1.5&bq=type%3Apostcode%5E0.6&bq=type%3Aadres%5E1&start=0&rows=10&sort=score%20desc%2Csortering%20asc&wt=json`;
        
        await fetch(url).then(response => response.json()).then(data => {          
          suggestionsData = data.response.docs;
        }).catch(error => {
          console.log(error);
        });

        if (suggestionsData.length === 1) {
            const place = suggestionsData[0].weergavenaam.split(',');
            const postcodeRegex = /(\d{4}[A-Za-z]{2})/;
            const houseNumber = place[0].split(' ')[1];
            const postcode = (place[1].match(postcodeRegex) || [])[1];

            // Update huisnummer input value
            const huisnummerInput = document.getElementById('huisnummer');
            if (huisnummerInput) {
                huisnummerInput.value = houseNumber;
            }

            // Update postcode input value
            const postcodeInput = document.getElementById('postcode');
            if (postcodeInput) {
                postcodeInput.value = postcode;
            }

            // Update straat input value
            const straatInput = document.getElementById('straat');
            if (straatInput) {
                straatInput.value = place[0].replace(houseNumber, '').trim();
            }

            // Update plaats input value
            const plaatsInput = document.getElementById('plaats');
            if (plaatsInput) {
                plaatsInput.value = place[1].replace(postcode, '').trim();
            }

        } else {
          return
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Handle error gracefully or provide feedback to the user
        return []; // Return empty array in case of an error
    }
  }
  

  function isFormValid(): boolean {
    return !Object.values($errors).some((field) =>
      Object.values(field).some(
        (errorObject: ValidatorResult) => errorObject.error,
      ),
    );
  }

  function validateField(field, value) {
    const validators = form[field]?.validators;

    if (validators && Array.isArray(validators)) {
        validators
        .filter((fn) => typeof fn === 'function') // Filter out undefined or non-function values
        .forEach((fn) => {
            const error = fn(value);
            errors.update((e) => {
            e[field] = { ...e[field], ...error };
            return e;
            });
        });
    }
  }

  function validateForm(data: { [inputName: string]: any }): void {
    Object.keys(data).forEach((field) => validateField(field, data[field]));
  }

  function onSubmit(e) {
    const formData = new FormData(e.target);

    const data: any = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    validateForm(data);

    return dispatch('submit', { valid: isFormValid(), data });
  }

  export function reset() {
    formEl.reset();
  }

  $:setContext('form', { errors, suggestions, onBlur, onInput, getSuggestions });
</script>

<form on:submit|preventDefault={onSubmit} bind:this={formEl}>
  <slot />
</form>
