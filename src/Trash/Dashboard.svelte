<script>
    import { authToken } from './../../stores/authStore.js';
    import { fly } from 'svelte/transition';
    import { updateProduct } from './../../fetch/Fetch.svelte';
    import { onMount } from 'svelte';

    const productsPerPage = 10;
    let searchKeyword = '';
    let currentPage = 1;
    let filteredData = [];
    let filter = [];
    let newRow = [];
    let editMode = false;
    let editingRowIndex = null;
    export let dynamicApiUrl;

    async function fetchData() {
        try {
            const response = await fetch(dynamicApiUrl, {
                headers: {
                    'Authorization': `Bearer ${$authToken}`
                }
            });
            
            filteredData = await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Use a reactive statement for computed properties and functions
    $: {
        if (filteredData) {
            // Create a computed property for filteredData
            filter = filteredData.product.filter(customer =>
                Object.values(customer).some(value =>
                    String(value).toLowerCase().includes(searchKeyword.toLowerCase())
                )
            );

            // Call the getInfo function
            getInfo(filter);
        }
    }

    function getInfo(displayedData) {
        if (displayedData.length > 0) {
            newRow = Object.keys(displayedData[0]);
        }
    }

    function handleSearchInput(event) {
        searchKeyword = event.target.value;
        // initializeData();
    }

    function handleFieldInput(event, key, rowIndex) {
        const newValue = event.target.tagName === 'TEXTAREA' ? event.target.value : event.target.innerText;
        filter[rowIndex][key] = newValue;
    }

    async function saveRow(row) {
        try {
            const updatedRow = await updateProduct(row, authToken);
            console.log('Row updated successfully:', updatedRow);
        } catch (error) {
            console.error('Error updating row:', error);
        } finally {
            toggleEditMode();
        }
    }

    function toggleEditMode() {
        editMode = !editMode;
    }

    function startEditing(rowIndex) {
        editingRowIndex = rowIndex;
        toggleEditMode();
    }

    function handlePageClick(page) {
        currentPage = page;
    }

    onMount(fetchData);
</script>

<div class="info-products" id="infoProducts" transition:fly={{ y: 100 }}>
    <!-- Display table only if there is data -->
    <h2 class="form-title"><span>All Requests</span></h2>
    <!-- Search box -->
    <div class="filter">
        <!-- Search input -->
        <div class="row">
            <div class="col">
                <div class="filter">
                    <div class="search-box">
                        <label for="searchCustomers">Search by Keyword</label>
                        <input on:input={handleSearchInput} class="search" id="searchCustomers" type="text" bind:value={searchKeyword} placeholder="Search">
                    </div>
                </div>
            </div>
            <div class="col">
                <p>{filteredData.length} Customers</p>
            </div>
        </div>
    </div>
    {#if filter.length > 0}
    <!-- Table of recent orders -->
    <div class="recent-orders">
        <table>
            <thead>
                <!-- Table header -->
                <tr class="first">
                    <th scope="col">Id</th>
                    {#each newRow as key}
                    {#if key === '_id'}
                    <th>manjaro id</th>
                    {:else if key === '__v'}
                    <th>user</th>
                    {:else}
                    <th>{key}</th>
                    {/if}
                    {/each}
                    <th class="a-right">Edit</th>
                </tr>
            </thead>
            <tbody>
                <!-- Table body rows -->
                {#each filter.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage) as row, rowIndex}
                <tr>
                    <!-- Row index -->
                    <td data-label="Id">{rowIndex + 1}</td>
                    <!-- Table cells -->
                    {#each Object.keys(row) as key}
                    {#if editMode && rowIndex === editingRowIndex}
                    {#if allowedKeys.includes(key)}
                    <!-- Editable cell -->
                    <td class:edit-mode={editMode && rowIndex === editingRowIndex} contenteditable="true" on:input={e => handleFieldInput(e, key, rowIndex)} data-label={key}>{row[key]}</td>
                    {:else if key === "status"}
                    <!-- Dropdown cell -->
                    <td>
                        <select style="width: 100%;" on:change={e => handleFieldInput(e, key, rowIndex)} value={row[key]}>
                            <option disabled value="">Select an option</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </td>
                    {:else}
                    <!-- Non-editable cell -->
                    <td data-label={key}>{row[key]}</td>
                    {/if}
                    {:else}
                    <!-- Non-editable cell -->
                    <td data-label={key}>{row[key]}</td>
                    {/if}
                    {/each}
                    <!-- Edit buttons -->
                    <td class="a-right">
                        {#if editMode && rowIndex === editingRowIndex}
                        <button on:click={() => saveRow(row)}>Save</button>
                        <button on:click={() => toggleEditMode()}>Cancel</button>
                        {:else if editMode && rowIndex !== editingRowIndex}
                        <!-- When editMode is true and rowIndex doesn't match editingRowIndex -->
                        <button on:click={() => toggleEditMode()}>Cancel</button>
                        {:else}
                        <!-- When editMode is false or rowIndex matches editingRowIndex -->
                        <button on:click={() => startEditing(rowIndex)}>Edit</button>
                        {/if}
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <!-- Pager -->
    <div class="pager">
        <!-- Pagination links -->
        <ul>
            <li> <a href="#" class="previous {currentPage === 1 ? 'disabled' : ''}" on:click={() => handlePageClick(currentPage - 1)}>Previous</a></li>
            {#each Array(Math.ceil(filter.length / productsPerPage)).fill() as _, index}
            <li><a href="#" class={index + 1 === currentPage ? 'active' : ''} on:click={() => handlePageClick(index + 1)}>{index + 1}</a></li>
            {/each}
            <li> <a href="#" class="next {currentPage == Math.ceil(filter.length / productsPerPage) ? 'disabled' : ''}" on:click={() => handlePageClick(currentPage + 1)}>Next</a></li>
        </ul>
    </div>
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

    /* Link Styles */
    a {
        text-decoration: none;
        color: #2c3e50;
    }

    a.active {
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

    .recent-orders a {
        text-align: center;
        display: block;
        margin: 1rem auto;
        transition: all 300ms ease;
        width: 15%;
    }

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

    .recent-orders a:hover {
        color: var(--color-danger)
    }
</style>





<!-- Add this for new info  -->
<!-- <tr style="color: grey">
<td contenteditable="false">id</td>
{#each newRow as column, columnIndex}
    {#if column == '_id'}
        <td contenteditable="false">manjaro id</td>
    {:else if column == '__v'}
    <td contenteditable="false">user</td>
    {:else if column == 'date'}
        <td contenteditable="false" >{column}</td>
    {:else if column == 'status'}
        <select style="background: black; color: grey" on:change={e => handleStatusChange(e, rowIndex)} value=column>
            <option value="Due">Due</option>
            <option value="Completed">Completed</option>
    
        </select>
    {:else}
        <td contenteditable="true" on:input={e => handleFieldInput(e, data.length, columnIndex)}>{column}</td>
    {/if}
{/each}
<button on:click={addRow}>add</button>
</tr> -->
