<script>
    import CrudTable from './tables/CrudTable.svelte';
    import Content from './Content.svelte';

    export let currentSection = '';
    export let character;

</script>
    {#if currentSection === 'dashboard'}
        <!-- <Dashboard /> -->
        <CrudTable dynamicApiUrl="http://localhost:3000/api/data/products"  />

    {:else if currentSection === 'customers'}
        <CrudTable dynamicApiUrl="http://localhost:3000/api/data/customers"  />

    {:else}
        <h1> Page not found </h1>
    {/if}

<style>

 

    .container {
        margin: 39px auto 0;
        padding: 40px;
        box-sizing: border-box;
        background: #ffffff;
        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
        border-radius: 10px;
        display: grid;
        gap: 20px;
        width: 100%;
    }

    img {
        max-width: 100%;
        height: auto;
        position: relative;
    }

    p {
        color: #2c3e50;
        padding-top: 5px;
        margin: 0;
    }

    .form-box h1::after {
        content: '';
        width: 30px;
        height: 4px;
        border-radius: 3px;
        background: #2c3e50;
        position: absolute;
        left: 50%;
        bottom: 15px;
        transform: translateX(-50%);
    }

    /* Input Styles */
    .input-control {
        display: flex;
        flex-direction: column;
        max-height: 100px;
        transition: max-height 0.3s ease;
        overflow: hidden;
    }

    .input-control .input-header {
        display: grid;
        align-items: center;
    }

    label {
        color: #999;
        padding-bottom: 5px;
    }

    .input-control input {
        border: 2px solid #f0f0f0;
        border-radius: 4px;
        display: block;
        font-size: 12px;
        padding: 10px;
    }

    .input-control input:focus {
        outline: 0;
    }

    .input-control.success input {
        border-color: #09c372;
    }

    .input-control.error input {
        border-color: #ff3860;
    }

    .input-control .error {
        color: #ff3860;
        font-size: 9px;
        height: 13px;
    }

    /* Button Styles */
    .btn-field {
        display: flex;
        justify-content: space-between;
    }

    .btn-field button {
        flex-basis: 48%;
        background: #2c3e50;
        color: #fff;
        height: 40px;
        border-radius: 20px;
        border: 0;
        outline: 0;
        cursor: pointer;
        transition: 0.3s ease-in-out;
    }

    .btn-field button.disable:hover,
    .btn-field button:hover {
        background: #2c3e50;
        color: #eaeaea;
    }

    .btn-field button.disable {
        background: #eaeaea;
        color: #555;
    }

    /* Link Styles */
    a {
        text-decoration: none;
        color: #2c3e50;
    }

    /* Error Styles */
    .input-field .error {
        color: #ff3860;
        font-size: 9px;
        height: 13px;
    }

    .input-control.error input {
        border-color: #ff3860;
    }

    form {
        width: 550px;
    }

    form * {
        font-weight: bold;
    }

    form label {
        font-size: 18px;
        color: #8f9096;
    }

    form .form-control,
    form .form-control:focus {
        border-color: transparent;
        border-bottom-color: #bebcc1;
        box-shadow: none;
    }

    form .btn {
        border-radius: 0px;
        border-color: transparent;
    }

    .btn.btn-default {
        background: #ebebeb;
        color: #8f9096;
    }

    .btn.btn-primary {
        background: #6c63ff;
        color: white;
    }

    ul {
        display: flex;
        gap: 5rem;
    }
</style>
