<script lang="ts">
	import  globalStore  from '/home/tom/Downloads/my-svelte-project-main/src/stores/global-store.js';
	import { formAdd } from './../../stores/formValidationRules.js';
    import { authToken, user } from './../../stores/authStore.js';
    import { fly } from 'svelte/transition';
    import DataFetcher from '../../fetch/Fetch.svelte';
    import { updateProduct } from './../../fetch/Fetch.svelte';
    import { data } from './../../stores/dataStore.js';

    const productsPerPage = 5;
    let currentPage = 1;
    let searchKeyword = '';
    let filteredData = [];
    let allowedKeys = ["number", "bedrijfsnaam", "dozen", "name", "username", "password", "email", "telefoonnummer", "plaats", "straat", "postcode", "huisnummer"];
    let newRow = [];
    let editMode = false;
    let editingRowIndex = null;
    let wrapper;
    export let dynamicApiUrl

    function handlePageClick(page) {
        currentPage = page;
        searchKeyword = '';
    }

    // Use a reactive statement for computed properties and functions
    $: {
        if ($data) {
            // Create a computed property for filteredData
            filteredData = $data.filter(customer =>
                Object.values(customer).some(value =>
                    String(value).toLowerCase().includes(searchKeyword.toLowerCase())
                )
            );

            // Call the getInfo function
            getInfo(filteredData);
        }
    }

    function getInfo(displayedData) {
        if (displayedData.length > 0) {
            newRow = Object.keys(displayedData[0]);
        }
    }

    function handleFieldInput(event, key, rowIndex) {
        
        let newValue = event.target.innerText;

        if (event.target.tagName === 'TEXTAREA' || event.target.tagName == 'SELECT') {
            newValue = event.target.value;
        }

        // Apply validators
        const validationResults = performValidation(key, newValue);

        // Handle validation results
        if (Object.values(validationResults).some(result => result.error)) {
            // Handle validation errors, e.g., show error message
            console.log('Validation errors:', validationResults);
        } else {
            // Update the data array with the new value if validation passes
            filteredData[rowIndex][key] = newValue;
        }
    }

    // Perform validation using the validators defined in Validators.ts
    function performValidation(key: string, value: any): ValidatorResult {
        const validators: ValidatorFn[] = formAdd[key]?.validators || [];
        const validationResults: ValidatorResult = {};

        for (const validator of validators) {
            const result = validator(value);
            Object.assign(validationResults, result);
        }

        return validationResults;
    }


    function saveRow(row) {
        // Call the API function to update the product
        
        editMode = !editMode;
        updateProduct(row, $authToken)
            .then(updatedRow => {
                console.log('Row updated successfully:', updatedRow);
            })
            .catch(error => {
                console.error('Error updating row:', error);
            });
    }

    function toggleEditMode() {
        editMode = !editMode;
    }

    function startEditing(rowIndex) {
        editingRowIndex = rowIndex;
        toggleEditMode()
    }


    const copyToClipboard = () => {
        const textarea = wrapper;
        navigator.clipboard.writeText(textarea.value);
        globalStore.toggleItem("alert", true, "Text copied", false);
    };
    
</script>

<DataFetcher url={dynamicApiUrl} />

<div class="info-products" id="infoProducts" transition:fly={{ y: 100 }}>
        <h2 class="form-title"><span>All Requests</span></h2>
        <!-- Search box -->
        <div class="filter">
            <div class="row">
                <div class="col">
                    <div class="filter">
                        <div class="search-box" style="display: grid;">
                            <label for="searchCustomers">Search by Keyword</label>
                            <input class="search" id="searchCustomers" type="text" bind:value={searchKeyword} placeholder="Search">
                        </div>
                    </div>
                </div>
                <div class="col" style="padding-bottom: 10px;">
                    <p>{filteredData.length} Customers</p>
                </div>
            </div>
        </div>
        <!-- Table of recent orders -->
        {#if filteredData.length > 0}
        <div class="recent-orders">
             <!-- content here -->
            <table>
                <thead>
                    <tr class="first">
                        <th scope="col">Id</th>
                        {#each newRow as key}
                            {#if key ==='_id'}
                                <th>manjaro id</th>
                            {:else if key === '__v'}
                                <th>user</th>
                            {:else if key === 'huisnummerToevoeging'}
                                <th>log</th>
                            {:else}
                                <th>{key}</th>
                            {/if}
                        {/each}
                        {#if $user.isAdmin}
                            <th class="a-right">Edit</th>
                        {:else}
                            <th class="a-right">Show</th>
                        {/if}
                    </tr>
                </thead>
                <tbody>
                    {#each filteredData as row, rowIndex}
                        {#if rowIndex >= (currentPage - 1) * productsPerPage && rowIndex < currentPage * productsPerPage}
                            <tr>
                                <td data-label="Id">{rowIndex + 1}</td>
                                {#each Object.keys(row) as key}   
                                     {#if editMode && rowIndex === editingRowIndex && $user.isAdmin}
                                        {#if allowedKeys.includes(key)}
                                            <td class:edit-mode={true} contenteditable="true" on:input={e => handleFieldInput(e, key, rowIndex)} data-label={key}>{row[key]}</td>
                                        {:else if key === "status"}
                                            <td>
                                                <select style="width: 100%;" on:change={e => handleFieldInput(e, key, rowIndex)}  id="{row[key]}" value={row[key]}>
                                                    <option disabled value="">Select an option</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                        {:else if key === "products"}
                                            <td id="{row[key]}" data-label={key}>{row[key].length}</td>
                                        {:else}
                                            <td id="{row[key]}" data-label={key}>{row[key]}</td>
                                        {/if}
                                    {:else if key === "_id"}
                                        <td id="{row[key]}" data-label="manjaro id">{row[key]}</td>
                                    {:else if key === "__v"}
                                        <td id="{row[key]}" data-label="Products">{row[key]}</td>
                                    {:else if key === "products"}
                                        <td id="{row[key]}" data-label={key}>{row[key].length}</td>
                                    {:else}
                                        <td id="{row[key]}" data-label={key}>{row[key]}</td>
                                    {/if}
                                {/each}
                                {#if $user.isAdmin}
                                    <td class="a-right" style="text-align: center;">
                                        {#if editMode && rowIndex === editingRowIndex}
                                            <button on:click={saveRow}>Save</button>
                                            <button on:click={toggleEditMode}>Cancel</button>
                                        {:else if editMode && rowIndex !== editingRowIndex}
                                            <!-- When editMode is true and rowIndex doesn't match editingRowIndex -->
                                            <button on:click={toggleEditMode}>Cancel</button>
                                        {:else}
                                            <!-- When editMode is false or rowIndex matches editingRowIndex -->
                                            <button on:click={() => startEditing(rowIndex)}>Edit</button>
                                        {/if}
                                    </td>
                                {:else}
                                    <td style="text-align: center;">
                                        <button  on:click={() => startEditing(rowIndex)}>Show info</button>
                                    </td>
                                {/if}
                            </tr>
                            <!-- Add a dropdown button to toggle visibility -->
                            {#if editMode && rowIndex === editingRowIndex}
                                <td colspan={Object.keys(row).length + 1}>
                                    <div style="display: flex; flex-direction: column" transition:fly={{ y: 100 }}>
                                        <!-- Add your dropdown content here -->
                                        {#if row.products}
                                            <textarea readonly style="resize: none; width: 500x; pointer-events: auto; box-sizing: border-box; white-space: nowrap; background: black; color: white; overflow: auto;" name="comment_text" rows="4" cols="4">
                                                {row.products.join('\n')}
                                            </textarea>
                                        {:else if row.comment && $user.isAdmin}
                                            <textarea bind:this={wrapper} on:input={e => handleFieldInput(e, "comment", rowIndex)} style="resize: none; background: black; color: white;"  name="comment_text" rows="4" cols="5">{row.comment}</textarea>
                                            <button on:click={copyToClipboard}>Copy</button>
                                        {:else if row.comment && !$user.isAdmin}
                                            <textarea bind:this={wrapper} readonly on:input={e => handleFieldInput(e, "comment", rowIndex)}  style="resize: none; background: black; color: white;"  name="comment_text" rows="4" cols="5">{row.comment}</textarea>
                                            <button on:click={copyToClipboard}>Copy</button>
                                        {/if}
                                    </div>
                                </td>
                            {/if}
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
        <!-- Pager -->
        <div class="pager" style="padding: 10px;">
            <ul>
                <li> <button class="previous {currentPage === 1 ? 'disabled' : ''}" on:click={() => handlePageClick(currentPage - 1)}>Previous</button></li>
                {#each Array(Math.ceil(filteredData.length / productsPerPage)).fill() as _, index}
                    <li><button class={index + 1 === currentPage ? 'active' : ''} on:click={() => handlePageClick(index + 1)}>{index + 1}</button></li>
                {/each}
                <li> <button class="next {currentPage == Math.ceil(filteredData.length / productsPerPage) ? 'disabled' : ''}" on:click={() => handlePageClick(currentPage + 1)}>Next</button></li>
            </ul>
        </div>
        {:else}
            <h1>No data found</h1>
        {/if}
</div>

<style>
    .edit-mode {
        background: #eee;
        color: black;
    }

    .disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    p {
        color: #2c3e50;
        padding-top: 5px;
        margin: 0;
    }

    label {
        color: #999;
        padding-bottom: 5px;
    }

    button.active {
        color: var(--color-danger);
    }

    /* Error Styles */

    ul {
        display: flex;
        gap: 5rem;
    }

    /* ================ INFO ORDERS BEGIN ================ */

    table tbody td {
        border-bottom: 1px solid var(--color-light);
    }

    table {
        border-spacing: 1;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        margin: 0 auto;
        position: relative;
    }

    .pager {
        display: grid;
        justify-items: center;
    }

    @media screen and (max-width: 1500px) {
        thead {
            display: none;
        }

        table tbody tr {
            height: auto;
        }

        td:before {
            content: attr(data-label);
            position: absolute;
            left: 27px;
        }

        .recent-orders {
            margin-right: 0px;
        }

        table tr,
        table td {
            display: block;
        }

        tr td {
            text-align: right;
        }

        table tbody tr td {
            margin-bottom: 24px;
        }
    }

    /* ================ INFO ORDERS END ================ */

    /* ======== RECENT-ORDERS BEGIN ======== */

    .recent-orders {
        margin-right: 15px;

    }

    .recent-orders table {
        background: var(--color-white);
        width: 100%;
        border-radius: var(--card-border-radius);
        padding: var(--card-padding);
        text-align: center;
        box-shadow: var(--box-shadow);
        transition: all 300ms ease;
    }

    .recent-orders table:hover {
        box-shadow: none;
    }
</style>