<script>
	import { authToken } from '../stores/authStore.js';
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';

    const productsPerPage = 10;
    let searchKeyword = '';
    let currentPage = 1;
    let filteredData
    let allowedKeys = ["number", "name", "username", "password", "email", "phone", "plaats", "straat", "postcode", "huisnummer"];
    let newRow;
    let editMode = false;
    let editingRowIndex = null;
    let collapsedRows = [];
    let displayedData;
    export let dynamicApiUrl;
    export let id

    console.log(id);

    onMount(async () => {
        try {
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Timeout occurred')), 5000); // Timeout after 5 seconds (adjust as needed)
            });

            const fetchDataPromise = fetch(`http://localhost:3000/api/data/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${$authToken}`,
                },
            }).then(response => response.json());

            const response = await Promise.race([fetchDataPromise, timeoutPromise]);

            if (response) {
                displayedData = response;
            }
        } catch (error) {
            console.error('Error fetching character data:', error);
        }
    });


    onMount(() => {
        // This function is called when the component is mounted
        setupInputEventListeners();
    });

    function toggleRow(rowId) {
        collapsedRows = collapsedRows.includes(rowId)
            ? collapsedRows.filter(id => id !== rowId)
            : [...collapsedRows, rowId];
    }

    function handlePageClick(page) {
        currentPage = page;
        searchKeyword = '';
    }

    $: console.log(displayedData);

    // Use reactive statements for computed properties and functions
    $: {
        if (displayedData) {
            // Create a computed property for filteredData
            filteredData = displayedData.product.filter(customer =>
                Object.values(customer).some(value =>
                    String(value).toLowerCase().includes(searchKeyword.toLowerCase())
                )
            );

            // Call getInfo function
            getInfo(filteredData);
        }
    }

    function getInfo(displayedData) {
        if (displayedData.length > 0) {
            newRow = Object.keys(displayedData[0]);
        }
    }

    function setupInputEventListeners() {
        const inputs = document.querySelectorAll('td[contenteditable="true"]');

        inputs.forEach((input, index) => {
            input.addEventListener("input", event => {
                const row = Math.floor(index / newRow.length);
                const columnIndex = index % newRow.length;
                handleFieldInput(event, row, columnIndex);
            });
        });
    }

    function handleFieldInput(event, row, columnIndex) {
        const newValue = event.target.innerHTML;
        // Your logic here, e.g., update the data array
        data[row][columnIndex] = newValue;
    }

    // function addRow() {
    //     if (editMode) {
    //         data = [...data, [...newRow]];
    //         toggleEditMode();
    //     } else {
    //         toggleEditMode();
    //     }
    // }

    // function deleteRow(rowToBeDeleted) {
    //     data = data.filter((_, index) => index !== rowToBeDeleted);
    // }


    function saveRow() {
        // Implement logic to save the changes for the currently edited row
        editingRowIndex = null; // Reset editing state
        editMode = !editMode;
    }

    function toggleEditMode() {
        editMode = !editMode;
    }

    function startEditing(rowIndex) {
        editingRowIndex = rowIndex;
        editMode = !editMode;
    }

</script>


<div class="info-products" id="infoProducts" transition:fly={{ y: 100 }}>
{#if displayedData}
    <h2 class="form-title"><span>All Requests</span></h2>
    <div class="filter">
        <div class="row">
            <div class="col">
                <div class="filter">
                    <div class="search-box">
                        <label for="search">Search by Keyword</label>
                        <input on:keydown={searchCustomers} class="search" id="searchCustomers" type="text" bind:value={searchKeyword} placeholder="Search">
                    </div>
                </div>
            </div>
            <div class="w-100"></div>
            <div class="col">
                <p>{displayedData.product.length} Customers</p>
            </div>
        </div>
    </div>

    <div class="recent-orders">
        <table>
            <thead>
                <tr class="first">
                    <th scope="col">Id</th>
                    {#each newRow as key}
                        {#if key == '_id'}
                            <th>manjaro id</th>
                        {:else if key == '__v'}
                            <th>user</th>
                        {:else}
                            <th>{key}</th>
                        {/if}
                    {/each}
                    <th class="a-right">Info</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredData as row, rowIndex}
                    {#if rowIndex >= (currentPage - 1) * productsPerPage && rowIndex < currentPage * productsPerPage}
                    <tr>
                        <td data-label="Id">{rowIndex + 1}</td>
                        {#each Object.keys(row) as key}
                            <td data-label={key}>{row[key]}</td>
                        {/each}
                        <!-- Add a dropdown button to toggle visibility -->
                        <button on:click={() => toggleRow(rowIndex)}>Toggle Info</button>
                    </tr>
                        {#if collapsedRows.includes(rowIndex)}
                            <tr>
                                <td colspan="{Object.keys(row).length + 1}">
                                    <div style="display: flex; flex-direction: column" transition:fly={{ y: 100 }}>
                                        <!-- Add your dropdown content here -->
                                        <textarea readonly style="resize: none; background: black; color: white;" id="w3review" name="w3review" rows="4" cols="50">
At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
                                        </textarea>
                                    </div>
                                </td>
                            </tr>
                        {/if}
                    {/if}
                {/each}
            </tbody>
        </table>
        
    </div>

    <div class="pager">
        <ul>
            <li> <a href="#" class="previous {currentPage === 1 ? 'disabled' : ''}" on:click={() => handlePageClick(currentPage - 1)}>previous</a></li>
            {#each Array(Math.ceil(filteredData.length / productsPerPage)).fill() as _, index}
            <li><a href="#" class={index + 1 === currentPage ? 'active' : ''} on:click={() => handlePageClick(index + 1)}>{index + 1}</a></li>
            {/each}
            <li> <a href="#" class="next {currentPage == Math.ceil(filteredData.length / productsPerPage) ? 'disabled' : ''}" on:click={() => handlePageClick(currentPage + 1)}>next</a></li>
        </ul>
    </div>
    {:else}
        <section><h1>There are no requests</h1></section>
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
