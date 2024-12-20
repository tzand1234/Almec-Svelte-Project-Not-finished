<script>
import { fetchData, addData } from './../fetch/Fetch.svelte';
import { onMount } from 'svelte';
import { createEventDispatcher } from 'svelte';


export let userId;
// let formData = null;

const PHONE_REGEX = /^\d{10}$/;
const POSTCODE_REGEX = /^\d{4}\s?[a-zA-Z]{2}$/;
const HUISNUMMER_REGEX = /^\d+[a-zA-Z]*$/;
const USERNAME_REGEX = /^[0-9a-z]+$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



let emailSuggestions = [];
let postcodeSuggestions = [];
let errorData;
let huisnummerSuggestions = [];
let isFormValid = false;
const dispatcher = createEventDispatcher();

function validateField(field, value, regex, message) {
    updateValidationStatus(field, regex.test(value), regex.test(value) ? '' : message);
}

function validatePhone(phoneValue) {
    validateField('phone', phoneValue, PHONE_REGEX, 'Please enter a valid phone number (10 digits).');
}

function validatePostcode(postcodeValue) {
    validateField('postcode', postcodeValue, POSTCODE_REGEX, 'Please enter a valid postcode (4 digits followed by 2 letters).');
}

function validateHuisnummer(huisnummerValue) {
    validateField('huisnummer', huisnummerValue, HUISNUMMER_REGEX, 'Please enter a valid huisnummer (only numbers and letters allowed).');
}

function validateUsername(usernameValue) {
    validateField('username', usernameValue, USERNAME_REGEX, 'Username should be at least 3 characters long and contain only lowercase letters and numbers.');
}

function validateBedrijfsNaam(usernameValue) {
    validateField('bedrijfsnaam', usernameValue, USERNAME_REGEX, 'bedrijfsnaam should be at least 3 characters long and contain only lowercase letters and numbers.');
}

function validateEmail(emailValue) {
    validateField('email', emailValue, EMAIL_REGEX, 'Please enter a valid email address.');
}

function extractPostcode(suggestion) {
    return suggestion.find(item => POSTCODE_REGEX.test(item)) || '';
}

function extractHouseNumber(suggestion) {
    const houseNumbers = suggestion.filter(item => HUISNUMMER_REGEX.test(item));
    return houseNumbers.length > 0 ? houseNumbers[0] : '';
}

function validatePassword() {
    const {
        bindValue: passwordValue
    } = fields.find(field => field.id === 'password');
    const validations = [{
            regex: /.{6,}/,
            message: 'Password needs to be at least 6 characters.'
        },
        {
            regex: /[a-z]/,
            message: 'Password must include a lowercase letter.'
        },
        {
            regex: /[A-Z]/,
            message: 'Password must include an uppercase letter.'
        },
        {
            regex: /[^a-zA-Z]/,
            message: 'Password must include a non-letter character.'
        },
    ];

    for (const {
            regex,
            message
        } of validations) {
        if (!regex.test(passwordValue)) {
            updateValidationStatus('password', false, message);
            return;
        }
    }

    updateValidationStatus('password', true, '');
}

function validateConfirmPassword() {
    const password2Value = fields.find(field => field.id === 'password2').bindValue;
    const passwordValue = fields.find(field => field.id === 'password').bindValue;

    const isValid = !password2Value || password2Value !== passwordValue;
    const message = isValid ? "Passwords don't match" : '';

    updateValidationStatus('password2', !isValid, message);
}

const updateValidationStatus = (fieldId, isValid, message) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
        field.isValid = isValid;
        field.validationMessage = message !== undefined ? message : '';
        field.validationClass = isValid ? 'success' : 'error';
    }
};

async function getSuggestions() {
    const postcodeField = fields.find(field => field.id === 'postcode');
    const huisnummerField = fields.find(field => field.id === 'huisnummer');

    let query = '';

    const postcodeFieldBindValue = postcodeField ? postcodeField.bindValue.trim() : '';
    const huisnummerFieldBindValue = huisnummerField ? huisnummerField.bindValue.trim() : '';

    if (postcodeFieldBindValue !== '') {
        query += postcodeFieldBindValue;

        if (huisnummerField && huisnummerFieldBindValue !== '') {
            query += ` ${huisnummerFieldBindValue}`;
        }
    } else {
        return [];
    }

    try {
        const response = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=${query}&fl=id%20weergavenaam%20type%20score%20adrestype&fq=type%3A%28gemeente%20OR%20woonplaats%20OR%20weg%20OR%20postcode%20OR%20adres%29&qf=exacte_match%5E1%20suggest%5E0.5%20huisnummer%5E0.5%20huisletter%5E0.5%20huisnummertoevoeging%5E0.5&bq=type%3Aprovincie%5E1.5&bq=type%3Agemeente%5E1.5&bq=type%3Awoonplaats%5E1.5&bq=type%3Aweg%5E1.5&bq=type%3Apostcode%5E0.6&bq=type%3Aadres%5E1&start=0&rows=10&sort=score%20desc%2Csortering%20asc&wt=json`);
        const data = await response.json();
        console.log(data);
        return data.response.docs || [];
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

function handleFieldInput(event, fieldId) {
    const fieldValue = event.target.value;
    fields = fields.map((field) => {
        if (field.id === fieldId) {
            field.bindValue = fieldValue;
        }
        return field;
    });

    switch (fieldId) {
        case 'postcode':
            getSuggestions().then(updateSuggestionsUI).then(() => validatePostcode(fieldValue));
            break;
        case 'huisnummer':
            getSuggestions().then(updateSuggestionsUI).then(() => validateHuisnummer(fieldValue));
            break;
        case 'email':
            const inputWithoutDomain = fieldValue.split('@')[0];
            const domainSuggestions = ['gmail.com', 'yahoo.com', 'outlook.com'];
            emailSuggestions = domainSuggestions.map((domain) => `${inputWithoutDomain}@${domain}`);
            validateEmail(fieldValue);
            break;
        case 'username':
            validateUsername(fieldValue);
            break;
        case 'bedrijfsnaam':
            validateBedrijfsNaam(fieldValue);
            break;
        case 'password':
        case 'password2':
            validatePassword(fieldValue);
            validateConfirmPassword();
            break;
        case 'phone':
            validatePhone(fieldValue);
            break;
        default:
            break;
    }

    updateValidationStatus('straat', true, '');
    updateValidationStatus('plaats', true, '');
    isFormValid = fields.every(field => field.isValid !== false);
}

function updateSuggestionsUI(suggestions) {
    const postcodeDataList = document.getElementById('postcodeSuggestions');
    const houseNumberDataList = document.getElementById('huisnummerSuggestions');

    // Clear existing options
    postcodeDataList.innerHTML = '';
    houseNumberDataList.innerHTML = '';

    const uniquePostcodes = new Set();
    const uniqueHouseNumbers = new Set();

    if (suggestions) {
        suggestions.forEach((suggestion) => {
            const postcode = extractPostcode(suggestion.weergavenaam.replace(',', '').split(' '));
            const houseNumber = extractHouseNumber(suggestion.weergavenaam.replace(',', '').split(' '));

            if (postcode && !uniquePostcodes.has(postcode)) {
                uniquePostcodes.add(postcode);

                const postcodeOption = document.createElement('option');
                postcodeOption.value = postcode;
                postcodeDataList.appendChild(postcodeOption);
            }

            if (houseNumber && !uniqueHouseNumbers.has(houseNumber)) {
                uniqueHouseNumbers.add(houseNumber);

                const houseNumberOption = document.createElement('option');
                houseNumberOption.value = houseNumber;
                houseNumberDataList.appendChild(houseNumberOption);
            }
        });

    } else {
        return;
    }

    if (suggestions.length === 0) {
        updateValidationStatus('postcode', false, 'Invalid postcode');
        updateValidationStatus('huisnummer', false, 'Invalid house number');
    } else {
        const place = suggestions[0].weergavenaam.split(',');
        const houseNumberRegex = /(\d+)/;
        const postcodeRegex = /(\d{4}[A-Za-z]{2})/;
        const houseNumber = (place[0].match(houseNumberRegex) || [])[1];
        const postcode = (place[1].match(postcodeRegex) || [])[1];

        const fieldsToUpdate = ['plaats', 'huisnummer', 'postcode', 'straat'];
        fieldsToUpdate.forEach(fieldName => {
            const field = fields.find(f => f.id === fieldName);
            if (field) {
                switch (fieldName) {
                    case 'huisnummer':
                        if (suggestions.length === 1) {
                            field.bindValue = houseNumber;
                            updateValidationStatus('huisnummer', true, '');
                        }
                        break;
                    case 'postcode':
                        field.bindValue = postcode;
                        updateValidationStatus('postcode', true, '');
                        break;
                    case 'straat':
                        field.bindValue = place[0].replace(houseNumber, '').trim();
                        break;
                    default:
                        field.bindValue = place[1].replace(postcode, '').trim();
                }
            }
        });
    }
}


// function updateSuggestionsUI(suggestions) {
//   if (suggestions.length > 0) {
//     console.log(suggestions)
//     console.log(suggestions[0].type == "adres")
//   }
  
//     const dataList = document.getElementById(listName);

//     if (!dataList) {
//         // console.error(`Element with ID "${listName}" not found.`);
//         return;
//     }

//     // Clear existing options
//     dataList.innerHTML = '';

//     const uniqueItems = new Set();
//     if (suggestions && suggestions.length > 0) {
      
//         suggestions.forEach((suggestion) => {
//           // console.log(suggestion)
//           if (suggestion.type === "adres" || suggestion.type === "postcode") {
//             let value;
//             if (name === 'postcode') {
//                 value = extractPostcode(suggestion.weergavenaam.replace(',', '').split(' '));
//             } else if (name === 'huisnummer') {
//                 value = extractHouseNumber(suggestion.weergavenaam.replace(',', '').split(' '));
//             }

//             if (value && !uniqueItems.has(value) && value.length > 0) {
//               // console.log(value)
//                 uniqueItems.add(value);
//                 const option = document.createElement('option');
//                 option.value = value;
//                 dataList.appendChild(option);
//             }
//           }
//         });

//     } else {
//         console.warn('No suggestions provided or incorrect name.');
//     }
// }

// $: updateSuggestionsUI($suggestions);

</script>